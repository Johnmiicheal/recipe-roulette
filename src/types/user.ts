export interface User {
  id: string;
  displayName: string;
  username: string;
  profilePicture: string;
  recipeCount: number;
  likesCount: number;
  subscriptionPlan: 'free' | 'pro' | 'student';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}