import { defineForm } from './types'
import { emailField, oneOf, requiredString } from './fields'

export const contactForm = defineForm({
  slug: 'contact',
  title: 'Contact MalabarJS',
  description:
    'Questions, ideas, partnerships, or just want to say hi - drop us a line and we\'ll get back to you.',
  icon: 'i-lucide-mail',
  submitLabel: 'Send message',
  success: {
    title: 'Message sent 📬',
    message:
      'Thanks for reaching out - we read everything and will reply at the email you shared.'
  },
  steps: [
    {
      title: 'Your message',
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
          name: 'topic',
          label: 'What is it about?',
          type: 'select',
          required: true,
          options: [
            { label: 'General question', value: 'general' },
            { label: 'Partnership / collaboration', value: 'partnership' },
            { label: 'Press / media', value: 'press' },
            { label: 'Feedback', value: 'feedback' },
            { label: 'Something else', value: 'other' }
          ],
          schema: oneOf([
            'general',
            'partnership',
            'press',
            'feedback',
            'other'
          ])
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          required: true,
          rows: 5,
          schema: requiredString('A line or two helps', 10, 2000)
        }
      ]
    }
  ]
})
