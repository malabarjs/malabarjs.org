import { defineForm } from './types'
import {
  emailField,
  oneOf,
  optionalString,
  requiredString,
  someOf
} from './fields'

export const volunteerForm = defineForm({
  slug: 'volunteer',
  title: 'Volunteer with MalabarJS',
  description:
    'Meetups don\'t run themselves. Help us with events, design, content, or the website - whatever fits your time.',
  icon: 'i-lucide-hand-heart',
  submitLabel: 'Count me in',
  success: {
    title: 'You\'re in 🥥',
    message:
      'Thanks for stepping up! We\'ll reach out at the email you shared when there\'s something to organize.'
  },
  steps: [
    {
      title: 'About you',
      fields: [
        {
          name: 'name',
          label: 'Full name',
          type: 'text',
          required: true,
          autocomplete: 'name',
          schema: requiredString('Please share your name', 2, 80)
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          autocomplete: 'email',
          schema: emailField()
        },
        {
          name: 'city',
          label: 'City / district',
          type: 'text',
          required: true,
          hint: 'e.g. Kochi, Calicut, Trivandrum',
          schema: requiredString('Where are you based?', 2, 80)
        }
      ]
    },
    {
      title: 'How you can help',
      fields: [
        {
          name: 'areas',
          label: 'What would you like to help with?',
          type: 'checkboxes',
          required: true,
          hint: 'Pick as many as you like',
          options: [
            { label: 'Event operations', value: 'event-ops' },
            { label: 'Design', value: 'design' },
            { label: 'Content / social media', value: 'content' },
            { label: 'Website / tech', value: 'tech' },
            { label: 'Photography / video', value: 'media' },
            { label: 'Community outreach', value: 'outreach' }
          ],
          schema: someOf([
            'event-ops',
            'design',
            'content',
            'tech',
            'media',
            'outreach'
          ])
        },
        {
          name: 'availability',
          label: 'How much time can you give?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Event days only', value: 'event-days' },
            { label: 'A few hours a week', value: 'weekly' },
            { label: 'Occasionally, when I can', value: 'occasional' }
          ],
          schema: oneOf(['event-days', 'weekly', 'occasional'])
        },
        {
          name: 'notes',
          label: 'Anything else we should know?',
          type: 'textarea',
          rows: 3,
          hint: 'Optional',
          schema: optionalString(1000)
        }
      ]
    }
  ]
})
