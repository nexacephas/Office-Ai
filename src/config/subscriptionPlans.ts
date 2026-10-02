import type { SubscriptionPlanId } from '../types'

export interface SubscriptionPlan {
  id: SubscriptionPlanId
  name: string
  description: string
  price: string
  billing: string
  features: string[]
  popular?: boolean
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with the essentials for a more organized office.',
    price: '$0',
    billing: 'per user / month',
    features: [
      'Personal workspace',
      'Document management',
      'Task management',
      'Basic search',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential tools for individuals and small office teams.',
    price: '$19',
    billing: 'per user / month',
    features: [
      'Document management',
      'Task management',
      'AI Assistant',
      'Basic search',
      'Personal workspace',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Advanced tools for growing teams and departments.',
    price: '$49',
    billing: 'per user / month',
    popular: true,
    features: [
      'Everything in Basic',
      'Advanced AI Assistant',
      'Advanced document search',
      'File Registry',
      'Workflow management',
      'Reports & analytics',
      'Meeting management',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete intelligent office operations for organizations.',
    price: 'Custom',
    billing: 'Tailored to your organization',
    features: [
      'Everything in Professional',
      'Organization-wide AI knowledge',
      'Advanced permissions & roles',
      'Approval workflows',
      'Audit logs',
      'Advanced reports',
      'AI agents & automation',
      'Dedicated support',
      'Custom integrations',
    ],
  },
]