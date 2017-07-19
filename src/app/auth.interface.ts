export interface AuthInterface {
  loggedIn: boolean;

  readonly redirectLoginUrl: string;

  isLoggedIn(): boolean;
  initiateLogin(): void;
  login(): void;
  initiateLogout(): void;
  logout(): void;
}
