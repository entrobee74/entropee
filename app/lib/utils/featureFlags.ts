import type { UserRecord, UserPlan } from '~/lib/services/entropeeStore';

export type FeatureName = 'hack_ai' | 'unlimited_builds' | 'all_connectors' | 'vercel_deploy';

export interface TrialStatus {
  isTrialing: boolean;
  isExpired: boolean;
  daysRemaining: number;
}

/**
 * Calculates trial status for a user based on `trial_started_at` and `trial_ends_at`.
 */
export function getTrialStatus(user: UserRecord): TrialStatus {
  if (!user.trial_ends_at) {
    return { isTrialing: false, isExpired: false, daysRemaining: 0 };
  }

  const now = new Date();
  const trialEnd = new Date(user.trial_ends_at);
  const diffMs = trialEnd.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isTrialing = diffMs > 0;
  const isExpired = diffMs <= 0;

  return {
    isTrialing,
    isExpired,
    daysRemaining,
  };
}

/**
 * Checks whether a user has access to a specific feature.
 * Hack AI is feature-flagged to Premium users only (or Premium active trial).
 */
export function hasFeature(user: UserRecord | undefined | null, feature: FeatureName): boolean {
  if (!user) return false;

  const trialStatus = getTrialStatus(user);

  switch (feature) {
    case 'hack_ai':
      // Hack AI requires Premium plan
      return user.plan === 'premium';

    case 'unlimited_builds':
      return user.plan === 'pro' || user.plan === 'premium';

    case 'all_connectors':
      return user.plan === 'pro' || user.plan === 'premium';

    case 'vercel_deploy':
      return user.plan === 'pro' || user.plan === 'premium';

    default:
      return false;
  }
}
