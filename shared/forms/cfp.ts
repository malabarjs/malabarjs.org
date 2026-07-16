import { defineForm } from './types'
import {
  emailField,
  oneOf,
  optionalString,
  optionalUrl,
  requiredString
} from './fields'

export const cfpForm = defineForm({
  slug: 'cfp',
  title: 'Speak at MalabarJS',
  description:
    'Got something worth sharing? First talk or fiftieth - we want to hear it. We help first-time speakers shape their talk.',
  icon: 'i-lucide-mic',
  submitLabel: 'Submit talk',
  aside: {
    text: 'Want feedback on your idea before submitting?',
    label: 'Start a GitHub Discussion',
    to: 'https://github.com/orgs/malabarjs/discussions'
  },
  success: {
    title: 'Talk submitted 🎤',
    message:
      'Thanks! We read every proposal and will get back to you at the email you shared.'
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
        },
        {
          name: 'github',
          label: 'GitHub / portfolio',
          type: 'url',
          hint: 'Optional',
          placeholder: 'https://github.com/username',
          schema: optionalUrl()
        }
      ]
    },
    {
      title: 'Your talk',
      fields: [
        {
          name: 'event',
          label: 'Which event is this for?',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'MalabarJS Meetup - Aug 22, 2026',
              value: 'meetup-2026-08'
            },
            { label: 'Any future event', value: 'future' }
          ],
          schema: oneOf(['meetup-2026-08', 'future'])
        },
        {
          name: 'talkTitle',
          label: 'Talk title',
          type: 'text',
          required: true,
          placeholder: 'A working title is fine',
          schema: requiredString('Give your talk a title', 4, 120)
        },
        {
          name: 'abstract',
          label: 'What is it about?',
          type: 'textarea',
          required: true,
          rows: 5,
          hint: 'A few sentences on what you\'ll cover and why it matters',
          schema: requiredString('A short abstract helps us out', 30, 2000)
        },
        {
          name: 'format',
          label: 'Format',
          type: 'radio',
          required: true,
          options: [
            { label: 'Lightning talk (5-10 min)', value: 'lightning' },
            { label: 'Standard talk (20-30 min)', value: 'standard' },
            { label: 'Hands-on workshop', value: 'workshop' }
          ],
          schema: oneOf(['lightning', 'standard', 'workshop'])
        },
        {
          name: 'audienceLevel',
          label: 'Audience level',
          type: 'radio',
          required: true,
          options: [
            { label: 'Beginner-friendly', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'Anyone', value: 'any' }
          ],
          schema: oneOf(['beginner', 'intermediate', 'advanced', 'any'])
        }
      ]
    },
    {
      title: 'Extras',
      description: 'All optional - skip anything that doesn\'t apply.',
      fields: [
        {
          name: 'experience',
          label: 'Have you spoken before?',
          type: 'textarea',
          rows: 3,
          hint: 'Links to past talks welcome. First-timers very welcome too.',
          schema: optionalString(1000)
        },
        {
          name: 'notes',
          label: 'Anything else?',
          type: 'textarea',
          rows: 3,
          schema: optionalString(1000)
        }
      ]
    }
  ]
})
