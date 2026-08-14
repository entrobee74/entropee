import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { entropeeStore, type UserPlan } from '~/lib/services/entropeeStore';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { plan, userId } = await request.json<{ plan: UserPlan; userId?: string }>();

    if (!plan || !['free', 'pro', 'premium'].includes(plan)) {
      return json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const currentUserId = userId || entropeeStore.getCurrentUserId();
    const updatedUser = entropeeStore.updateUserPlan(currentUserId, plan);

    return json({
      success: true,
      message: `Successfully upgraded to ${plan.toUpperCase()} plan.`,
      user: updatedUser,
    });
  } catch (error: any) {
    return json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}
