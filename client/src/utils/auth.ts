import { JwtPayload, jwtDecode } from 'jwt-decode';

interface UserPayload extends JwtPayload {
  id: string;
  username: string;
}

class AuthService {
  // This is the time in milliseconds before the user is logged out due to inactivity
  private readonly INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
  private inactivityTimer: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupActivityMonitoring();
    }
  }

  private setupActivityMonitoring(): void {
    // Monitors user activity
    ['mousedown', 'keydown', 'mousemove', 'touchstart', 'scroll'].forEach(eventType => {
      window.addEventListener(eventType, () => this.resetInactivityTimer());
    });

    // Sets initial timer if user is logged in
    if (this.loggedIn()) {
      this.resetInactivityTimer();
    }
  }
  // This resets the inactivity timer
  private resetInactivityTimer(): void {
    this.lastActivityTime = Date.now();
    
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      console.log('User inactive for too long, logging out');
      this.logout();
    }, this.INACTIVITY_TIMEOUT);
  }

  // This decodes the token and returns the payload
  getProfile(): UserPayload | null {
    const token = this.getToken();
    return token ? jwtDecode<UserPayload>(token) : null;    
  }

// This checks if a valid token exists and is not expired
  loggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<UserPayload>(token);
      const currentTime = Date.now() / 1000;

      // Checks both JWT expiration and inactivity
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('Token expired');
        this.logout();
        return false;
      }

      const inactiveTime = Date.now() - this.lastActivityTime;
      if (inactiveTime > this.INACTIVITY_TIMEOUT) {
        console.log('Session expired due to inactivity');
        this.logout();
        return false;
      }

      return true;
    } catch (err) {
      console.log('Error decoding token:', err);
      this.logout();
      return false;
    }
  }

  // This checks if the token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<UserPayload>(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.log('Token expired');
        this.logout();
        return true;
      }
      return false;
    } catch (err) {
      console.log('Error decoding token:', err);
      return true;
    }
  }

// This retrieves the token from local storage
  getToken(): string | null{
    return localStorage.getItem('id_token');
  }

// This stores the token in local storage and redirects to the form page
  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    this.lastActivityTime = Date.now();
    this.resetInactivityTimer();
    window.location.assign('/Form');
  }

  // This removes the token from local storage and redirects to the login page
  logout(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    
    localStorage.removeItem('id_token');
    this.lastActivityTime = 0;

    window.location.assign('/');
  }

  // This retrieves the user from the token
  getUser(): { id: string; username: string } | null {
    const profile = this.getProfile();
    return profile ? { id: profile.id, username: profile.username } : null;
  }

  // This checks if the user is authenticated and redirects if not
  checkAuthAndRedirect(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return false;
    } 
      return true;
    }
  }


export default new AuthService();