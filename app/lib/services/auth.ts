import { entropeeStore, type UserRecord, type UserPlan } from './entropeeStore';

export interface AuthSession {
  user: UserRecord;
  isAuthenticated: boolean;
}

class AuthService {
  getCurrentSession(): AuthSession {
    const user = entropeeStore.getCurrentUser();
    return {
      user,
      isAuthenticated: !!user,
    };
  }

  signup(email: string, name?: string, plan: UserPlan = 'free'): UserRecord {
    const user = entropeeStore.createUser(email, name, plan);
    return user;
  }

  login(email: string): UserRecord {
    const users = entropeeStore.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Auto register demo account on login if not found
      user = this.signup(email);
    } else {
      entropeeStore.setCurrentUserId(user.id);
    }

    return user;
  }

  loginWithOAuth(provider: 'google' | 'github'): UserRecord {
    const mockEmail = `builder_${provider}@entropee.ai`;
    return this.login(mockEmail);
  }

  logout(): void {
    // Reset to default demo user or clear session
    const users = entropeeStore.getUsers();
    if (users.length > 0) {
      entropeeStore.setCurrentUserId(users[0].id);
    }
  }
}

export const authService = new AuthService();
