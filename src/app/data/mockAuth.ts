import { AuthState } from '@/types/user';

export const mockAuthState: AuthState = {
  isAuthenticated: false,
  user: {
    id: '1',
    displayName: 'Sarah Johnson',
    username: 'sarahcooks',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    recipeCount: 15,
    likesCount: 243,
    subscriptionPlan: 'student'
  }
};