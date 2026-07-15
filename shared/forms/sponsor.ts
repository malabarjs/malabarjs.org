import { defineForm } from './types'
import {
  emailField,
  optionalUrl,
  requiredString,
  someOf
} from './fields'

export const sponsorForm = defineForm({
  slug: 'sponsor',
  title: 'Sponsor MalabarJS',
  description:
    'Back the JavaScript community in Kerala - venues, food, swag, or tooling. Every meetup runs on support like yours.',
  icon: 'i-lucide-handshake',
  submitLabel: 'Start the conversation',
  success: {
    title: 'Thank you 🙌',
    message:
      'We appreciate you backing the community. We\'ll get in touch at the email you shared to figure out the details.'
  },
  steps: [
    {
      title: 'Your organization',
      fields: [
        {
          name: 'organization',
          label: 'Organization name',
          type: 'text',
          required: true,
          autocomplete: 'organization',
          schema: requiredString('What\'s the organization called?', 2, 120)
        },
        {
          name: 'website',
          label: 'Website',
          type: 'url',
          hint: 'Optional',
          placeholder: 'https://example.com',
          schema: optionalUrl()
        },
        {
          name: 'name',
          label: 'Contact person',
          type: 'text',
          required: true,
          autocomplete: 'name',
          schema: requiredString('Who should we talk to?', 2, 80)
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          autocomplete: 'email',
          schema: emailField()
        }
      ]
    },
    {
      title: 'How you\'d like to support',
      fields: [
        {
          name: 'supportTypes',
          label: 'What kind of support?',
          type: 'checkboxes',
          required: true,
          hint: 'Pick as many as apply',
          options: [
            { label: 'Venue / space', value: 'venue' },
            { label: 'Food & beverages', value: 'food' },
            { label: 'Swag / giveaways', value: 'swag' },
            { label: 'Financial sponsorship', value: 'cash' },
            { label: 'Tooling / credits', value: 'tooling' },
            { label: 'Something else', value: 'other' }
          ],
          schema: someOf(['venue', 'food', 'swag', 'cash', 'tooling', 'other'])
        },
        {
          name: 'message',
          label: 'Tell us a bit more',
          type: 'textarea',
          required: true,
          rows: 4,
          hint: 'What you have in mind, budget range if relevant, timelines',
          schema: requiredString('A line or two helps us respond well', 10, 2000)
        }
      ]
    }
  ]
})
