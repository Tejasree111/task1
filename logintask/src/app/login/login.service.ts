import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private tokenKey = 'token';
  private userDataKey = 'userData';
  

  constructor(private http: HttpClient, private router: Router) {}

  // Check if the user is logged in by verifying the token in localStorage
  get isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

   // Login function
   login(loginData: { type: string; email: string; password: string }) {
    const loginUrl = `${environment.apiBaseUrl}/api/login`;

    return this.http
      .post<{
        success: boolean;
        message: string;
        token?: string;
        userData?: { fname: string; lname: string; email: string; type: string };
      }>(loginUrl, loginData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Login successful', response);

            // Save token and user data to localStorage
            localStorage.setItem(this.tokenKey, response.token || '');
            localStorage.setItem(
              this.userDataKey,
              JSON.stringify(response.userData)
            );

            this.router.navigate(['/home']);
          } else {
            alert('Invalid email or password');
          }
        },
        error: (error) => {
          console.error('Login error', error);
          alert('An error occurred during login');
        },
        complete: () => {
          console.log('Login request completed');
        },
      });
  }

  // Logout function
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userDataKey);
    this.router.navigate(['/login']);
  }
}