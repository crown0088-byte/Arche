interface AuthState {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
}
type AuthContext = {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
  refreshAuth: () => promises<boolean>
  signIn: () => Promise<boolean>;
  signOut: () => promises<boolean>;


}