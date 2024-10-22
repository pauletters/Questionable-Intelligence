import { JwtPayload, jwtDecode } from 'jwt-decode';

interface UserPayload extends JwtPayload {
  id: string;
  username: string;
}

class AuthService {
  // This decodes the token and returns the payload
  getProfile(): UserPayload | null {
    const token = this.getToken();
    return token ? jwtDecode<UserPayload>(token) : null;    
  }

// This checks if a valid token exists
  loggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
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
    window.location.assign('/form');
  }

  // This removes the token from local storage and redirects to the login page
  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/login');
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