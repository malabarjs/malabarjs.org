#!/usr/bin/env node
/**
 * One-off import of legacy members (Google Sheet joins) into Postgres.
 *
 * Usage:
 *   DATABASE_URL=postgres://… node scripts/import-members.mjs <csv-url-or-file>
 *
 * Accepts the published Google Sheet CSV URL or a local CSV export. Rows are
 * stored as `form_submissions` rows with form_slug 'join' (the retired join
 * form). Rows whose email already exists in the table are skipped, so the
 * script is safe to re-run.
 */
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import postgres from 'postgres'

const source = process.argv[2]
const databaseUrl = process.env.DATABASE_URL

if (!source || !databaseUrl) {
  console.error(
    'Usage: DATABASE_URL=postgres://… node scripts/import-members.mjs <csv-url-or-file>'
  )
  process.exit(1)
}

/** Full CSV parser - handles quoted fields, embedded commas and newlines. */
const parseCsv = (text) => {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      field = ''
      rows.push(row)
      row = []
    } else if (ch !== '\r') {
      field += ch
    }
  }
  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter(r => r.some(cell => cell.trim() !== ''))
}

const TIMESTAMP_RE
  = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/

/**
 * Sheet timestamps are D/M/YYYY or M/D/YYYY depending on the sheet's locale.
 * Detect which by looking for a part that exceeds 12 across all rows;
 * ambiguous sheets default to M/D (Google's US default).
 */
const detectDayFirst = (values) => {
  for (const raw of values) {
    const m = raw?.trim().match(TIMESTAMP_RE)
    if (!m) continue
    if (+m[1] > 12) return true
    if (+m[2] > 12) return false
  }
  return false
}

const parseTimestamp = (raw, dayFirst) => {
  if (!raw) return null
  const m = raw.trim().match(TIMESTAMP_RE)
  if (m) {
    const [, a, b, year, hh = '0', mm = '0', ss = '0'] = m
    const [day, month] = dayFirst ? [a, b] : [b, a]
    const date = new Date(
      Date.UTC(+year, +month - 1, +day, +hh, +mm, +ss)
    )
    if (!Number.isNaN(date.getTime())) return date
  }
  const fallback = new Date(raw)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

const fetchCsv = async () => {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source, { redirect: 'follow' })
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    return res.text()
  }
  return readFile(source, 'utf8')
}

const csv = await fetchCsv()
const [header, ...rows] = parseCsv(csv)
if (!header || !rows.length) {
  console.error('No data rows found in CSV')
  process.exit(1)
}

const normalize = h => h.toLowerCase().replace(/[^a-z0-9]/g, '')
const emailIdx = header.findIndex(h => normalize(h).includes('email'))
const timestampIdx = header.findIndex(h => normalize(h).includes('timestamp'))
if (emailIdx === -1) {
  console.error(`No email column found. Headers: ${header.join(' | ')}`)
  process.exit(1)
}

const dayFirst
  = timestampIdx === -1
    ? false
    : detectDayFirst(rows.map(row => row[timestampIdx]))

const sql = postgres(databaseUrl, { max: 1, prepare: false })

try {
  const existing = new Set(
    (await sql`SELECT lower(email) AS email FROM form_submissions WHERE email IS NOT NULL`)
      .map(r => r.email)
  )

  let imported = 0
  let skipped = 0

  for (const row of rows) {
    const email = (row[emailIdx] ?? '').trim().toLowerCase()
    if (!email || existing.has(email)) {
      skipped++
      continue
    }

    const data = Object.fromEntries(
      header.map((h, i) => [h, (row[i] ?? '').trim()]).filter(([, v]) => v)
    )
    const createdAt
      = timestampIdx === -1
        ? null
        : parseTimestamp(row[timestampIdx], dayFirst)

    await sql`
      INSERT INTO form_submissions (form_slug, email, data, created_at)
      VALUES ('join', ${email}, ${sql.json(data)}, ${createdAt ?? sql`now()`})
    `
    existing.add(email)
    imported++
  }

  console.log(`Imported ${imported} members, skipped ${skipped} (duplicate or no email).`)
} finally {
  await sql.end()
}
