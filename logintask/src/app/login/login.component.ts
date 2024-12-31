
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/Material.Module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;

    
    this.http.post<{ success: boolean, message: string, token?: string }>('http://localhost:3000/api/login', loginData).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('token', response.token || '');
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
      }
    });
  }
}
