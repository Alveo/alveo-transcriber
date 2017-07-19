export interface AuthInterface {
  loggedIn: boolean;

  isLoggedIn(): boolean;
  initiateLogin(): void;
  login(): void;
  initiateLogout(): void;
  logout(): void;
}
