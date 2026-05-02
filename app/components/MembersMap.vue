<script setup lang="ts">
import INDIA from '@svg-maps/india'
import { MEMBERS, DISTRICT_COORDS } from '~/data/members'

// Kerala bounding box (lng/lat)
const BBOX = { minLng: 74.86, maxLng: 77.4, minLat: 8.18, maxLat: 12.78 }

interface Location {
  id: string
  name: string
  path: string
}
const locations = INDIA.locations as Location[]
const kerala = locations.find(l => l.id === 'kl')!

// Computed after mount from the actual rendered path bbox.
const keralaViewBox = ref('0 0 100 100')

interface DistrictDot {
  district: string
  x: number
  y: number
  count: number
}

const dots = ref<DistrictDot[]>([])
const keralaPathRef = ref<SVGPathElement | null>(null)

const grouped = (() => {
  const byDistrict = new Map<string, number>()
  for (const m of MEMBERS) {
    byDistrict.set(m.district, (byDistrict.get(m.district) ?? 0) + 1)
  }
  return byDistrict
})()

const computeDots = () => {
  const path = keralaPathRef.value
  if (!path) return
  const bbox = path.getBBox()
  const pad = Math.max(bbox.width, bbox.height) * 0.06
  keralaViewBox.value = `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`

  const out: DistrictDot[] = []
  for (const [district, count] of grouped) {
    const coord = DISTRICT_COORDS[district]
    if (!coord) continue
    const xRatio = (coord.lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)
    const yRatio = (BBOX.maxLat - coord.lat) / (BBOX.maxLat - BBOX.minLat)
    out.push({
      district,
      x: bbox.x + xRatio * bbox.width,
      y: bbox.y + yRatio * bbox.height,
      count
    })
  }
  out.sort((a, b) => b.count - a.count)
  dots.value = out
}

const maxCount = computed(() => Math.max(1, ...dots.value.map(d => d.count)))

const radiusFor = (count: number) => {
  const min = 1.2
  const max = 3
  return min + (count / maxCount.value) * (max - min)
}

const districtList = computed(() =>
  Array.from(grouped.entries())
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count)
)

onMounted(() => {
  // Wait a tick for SVG to render
  requestAnimationFrame(computeDots)
})
</script>

<template>
  <section class="border-t border-default px-4 sm:px-6 py-12 sm:py-16">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <p class="text-xs font-mono uppercase text-muted tracking-wider mb-1">
            The map
          </p>
          <h2 class="text-2xl sm:text-3xl font-bold text-highlighted">
            Where MalabarJS lives 🇮🇳
          </h2>
        </div>
        <p class="text-sm text-muted text-right">
          {{ MEMBERS.length }} members · {{ districtList.length }} districts
        </p>
      </div>

      <div class="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
        <div
          class="bg-elevated/40 border border-default rounded-xl p-4 overflow-hidden"
        >
          <svg
            :viewBox="keralaViewBox"
            class="w-full h-auto block max-h-[560px]"
            role="img"
            :aria-label="`Map of MalabarJS members across ${districtList.length} Kerala districts`"
          >
            <path
              ref="keralaPathRef"
              :d="kerala.path"
              class="fill-elevated stroke-default"
              stroke-width="0.4"
              stroke-linejoin="round"
            />

            <g v-if="dots.length">
              <g
                v-for="d in dots"
                :key="d.district"
              >
                <circle
                  :cx="d.x"
                  :cy="d.y"
                  :r="radiusFor(d.count)"
                  class="fill-primary"
                >
                  <title>
                    {{ d.district }} · {{ d.count }}
                    {{ d.count === 1 ? "member" : "members" }}
                  </title>
                </circle>
                <circle
                  :cx="d.x"
                  :cy="d.y"
                  :r="radiusFor(d.count)"
                  fill="none"
                  class="stroke-primary"
                  stroke-width="0.25"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    :from="radiusFor(d.count)"
                    :to="radiusFor(d.count) * 2.8"
                    dur="2.6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="2.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </g>
          </svg>

          <p class="text-[10px] text-muted text-right mt-2 font-mono">
            map data:
            <a
              href="https://www.npmjs.com/package/@svg-maps/india"
              target="_blank"
              rel="noopener"
              class="hover:text-primary"
            >@svg-maps/india</a>
            (CC BY 4.0)
          </p>
        </div>

        <div>
          <ul class="grid grid-cols-2 gap-x-4 gap-y-1">
            <li
              v-for="d in districtList"
              :key="d.district"
              class="flex items-center justify-between gap-2 py-1.5 border-b border-default text-sm"
            >
              <span class="text-highlighted font-medium">{{ d.district }}</span>
              <span class="font-mono text-xs text-muted tabular-nums">{{
                d.count
              }}</span>
            </li>
          </ul>
          <p class="text-xs text-muted mt-4">
            Counts only - no individual contact details are shown publicly.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
