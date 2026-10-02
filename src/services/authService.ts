import type { SubscriptionPlanId } from '../types'

const authenticationKey = 'officepilot_auth'
const accountKey = 'officepilot_account'
const pendingPlanKey = 'officepilot_signup_plan'

export interface TemporaryAccount {
  name: string
  email: string
  organization: string
  plan: SubscriptionPlanId
  planName: string
  planPrice: string
  planBilling: string
}

function isPlanId(value: string | null): value is SubscriptionPlanId {
  return value === 'free' || value === 'basic' || value === 'professional' || value === 'enterprise'
}

export function isAuthenticated() {
  return localStorage.getItem(authenticationKey) === 'true'
}

export function startTemporarySession() {
  localStorage.setItem(authenticationKey, 'true')
}

export function createTemporaryAccount(account: TemporaryAccount) {
  localStorage.setItem(accountKey, JSON.stringify(account))
  startTemporarySession()
}

export function getTemporaryAccount(): TemporaryAccount | null {
  const storedAccount = localStorage.getItem(accountKey)
  if (!storedAccount) return null

  try {
    const account = JSON.parse(storedAccount) as Partial<TemporaryAccount>
    if (
      typeof account.name !== 'string' ||
      typeof account.email !== 'string' ||
      typeof account.organization !== 'string' ||
      typeof account.plan !== 'string' ||
      !isPlanId(account.plan)
    ) {
      return null
    }

    return account as TemporaryAccount
  } catch {
    return null
  }
}

export function savePendingPlan(plan: SubscriptionPlanId) {
  sessionStorage.setItem(pendingPlanKey, plan)
}

export function getPendingPlan(): SubscriptionPlanId | null {
  const storedPlan = sessionStorage.getItem(pendingPlanKey)
  return isPlanId(storedPlan) ? storedPlan : null
}

export function clearPendingPlan() {
  sessionStorage.removeItem(pendingPlanKey)
}

export function endTemporarySession() {
  localStorage.removeItem(authenticationKey)
}