function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}

export type UserPlan = 'free' | 'pro' | 'premium';
export type BuildStatus = 'draft' | 'live' | 'archived';
export type ConnectorProvider = 'github' | 'slack' | 'notion' | 'google_drive';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  trial_started_at: string;
  trial_ends_at: string;
  created_at: string;
}

export interface BuildRecord {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  prompt_history: any[];
  preview_url: string;
  status: BuildStatus;
  created_at: string;
  updated_at: string;
}

export interface ConnectorRecord {
  id: string;
  user_id: string;
  provider: ConnectorProvider;
  status: 'connected' | 'disconnected';
  credentials_ref: string;
  connected_at: string;
  last_synced_at: string;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan: UserPlan;
  trial_or_paid: 'trial' | 'paid';
  renewal_date: string;
  status: 'active' | 'canceled' | 'expired';
}

const STORAGE_KEYS = {
  USERS: 'entropee_users',
  BUILDS: 'entropee_builds',
  CONNECTORS: 'entropee_connectors',
  SUBSCRIPTIONS: 'entropee_subscriptions',
  CURRENT_USER_ID: 'entropee_current_user_id',
};

// Default seed data
const DEFAULT_USER: UserRecord = {
  id: 'user_demo_123',
  email: 'demo@entropee.ai',
  name: 'Demo Builder',
  plan: 'premium', // Default demo user gets premium trial access
  trial_started_at: new Date().toISOString(),
  trial_ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
};

const DEFAULT_BUILDS: BuildRecord[] = [
  {
    id: 'build_1',
    user_id: 'user_demo_123',
    name: 'Fintech Dashboard',
    description: 'React • Tailwind • D3.js',
    prompt_history: [{ role: 'user', content: 'Build a fintech dashboard' }],
    preview_url: '/webcontainer/preview/build_1',
    status: 'live',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'build_2',
    user_id: 'user_demo_123',
    name: 'Art Gallery UI',
    description: 'Next.js • Framer Motion',
    prompt_history: [{ role: 'user', content: 'Build an art gallery portfolio UI' }],
    preview_url: '/webcontainer/preview/build_2',
    status: 'draft',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'build_3',
    user_id: 'user_demo_123',
    name: 'SaaS Landing Page',
    description: 'HTML • Tailwind CSS',
    prompt_history: [{ role: 'user', content: 'Build a SaaS landing page' }],
    preview_url: '/webcontainer/preview/build_3',
    status: 'archived',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
    updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class EntropeeStoreService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- User Operations ---
  getUsers(): UserRecord[] {
    if (!this.isBrowser()) return [DEFAULT_USER];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      this.saveUsers([DEFAULT_USER]);
      return [DEFAULT_USER];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [DEFAULT_USER];
    }
  }

  private saveUsers(users: UserRecord[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  getUserById(id: string): UserRecord | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  createUser(email: string, name?: string, plan: UserPlan = 'free'): UserRecord {
    const users = this.getUsers();
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5-day trial

    const newUser: UserRecord = {
      id: `user_${generateId()}`,
      email,
      name: name || email.split('@')[0],
      plan,
      trial_started_at: now.toISOString(),
      trial_ends_at: trialEnd.toISOString(),
      created_at: now.toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUserId(newUser.id);
    return newUser;
  }

  updateUserPlan(userId: string, plan: UserPlan): UserRecord | undefined {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return undefined;

    users[userIndex].plan = plan;
    this.saveUsers(users);
    return users[userIndex];
  }

  getCurrentUserId(): string {
    if (!this.isBrowser()) return DEFAULT_USER.id;
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || DEFAULT_USER.id;
  }

  setCurrentUserId(id: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    }
  }

  getCurrentUser(): UserRecord {
    const id = this.getCurrentUserId();
    return this.getUserById(id) || DEFAULT_USER;
  }

  // --- Builds Operations ---
  getBuilds(userId?: string): BuildRecord[] {
    if (!this.isBrowser()) return DEFAULT_BUILDS;
    const data = localStorage.getItem(STORAGE_KEYS.BUILDS);
    let builds: BuildRecord[] = DEFAULT_BUILDS;
    if (data) {
      try {
        builds = JSON.parse(data);
      } catch {
        builds = DEFAULT_BUILDS;
      }
    } else {
      this.saveBuilds(DEFAULT_BUILDS);
    }

    const targetUserId = userId || this.getCurrentUserId();
    return builds.filter((b) => b.user_id === targetUserId);
  }

  private saveBuilds(builds: BuildRecord[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.BUILDS, JSON.stringify(builds));
    }
  }

  getBuildById(id: string): BuildRecord | undefined {
    if (!this.isBrowser()) return DEFAULT_BUILDS.find((b) => b.id === id);
    const data = localStorage.getItem(STORAGE_KEYS.BUILDS);
    const builds: BuildRecord[] = data ? JSON.parse(data) : DEFAULT_BUILDS;
    return builds.find((b) => b.id === id);
  }

  createBuild(name: string, description?: string, promptHistory: any[] = []): BuildRecord {
    const currentUserId = this.getCurrentUserId();
    const allBuilds = this.getAllBuildsRaw();
    const now = new Date().toISOString();

    const newBuild: BuildRecord = {
      id: `build_${generateId()}`,
      user_id: currentUserId,
      name,
      description: description || 'React • Tailwind',
      prompt_history: promptHistory,
      preview_url: `/build/${generateId()}/preview`,
      status: 'draft',
      created_at: now,
      updated_at: now,
    };

    allBuilds.unshift(newBuild);
    this.saveBuilds(allBuilds);
    return newBuild;
  }

  private getAllBuildsRaw(): BuildRecord[] {
    if (!this.isBrowser()) return DEFAULT_BUILDS;
    const data = localStorage.getItem(STORAGE_KEYS.BUILDS);
    if (!data) return DEFAULT_BUILDS;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_BUILDS;
    }
  }

  // --- Connectors Operations ---
  getConnectors(userId?: string): ConnectorRecord[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.CONNECTORS);
    if (!data) return [];
    try {
      const connectors: ConnectorRecord[] = JSON.parse(data);
      const targetUserId = userId || this.getCurrentUserId();
      return connectors.filter((c) => c.user_id === targetUserId);
    } catch {
      return [];
    }
  }

  toggleConnector(provider: ConnectorProvider): ConnectorRecord {
    const currentUserId = this.getCurrentUserId();
    const allData = this.getAllConnectorsRaw();
    const now = new Date().toISOString();

    let connector = allData.find((c) => c.user_id === currentUserId && c.provider === provider);

    if (connector) {
      connector.status = connector.status === 'connected' ? 'disconnected' : 'connected';
      connector.last_synced_at = now;
    } else {
      connector = {
        id: `conn_${generateId()}`,
        user_id: currentUserId,
        provider,
        status: 'connected',
        credentials_ref: `token_ref_${provider}_${generateId()}`,
        connected_at: now,
        last_synced_at: now,
      };
      allData.push(connector);
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONNECTORS, JSON.stringify(allData));
    }

    return connector;
  }

  private getAllConnectorsRaw(): ConnectorRecord[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.CONNECTORS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

export const entropeeStore = new EntropeeStoreService();
