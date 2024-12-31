import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/Material.Module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.regForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const cpassword = form.get('cpassword')?.value;
    if (password !== cpassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  ngOnInit(): void {
  }

  submit() {
    this.submitted = true;
    if (this.regForm.invalid) {
      if (this.regForm.errors?.['mismatch']) {
        alert('Passwords do not match!');
      }
      return;
    }

    const userDetails = {
      fname: this.regForm.get('fname')?.value,
      lname: this.regForm.get('lname')?.value,
      email: this.regForm.get('email')?.value,
      password: this.regForm.get('password')?.value
    };

    this.http.post<{ success: boolean, message: string }>('http://localhost:3000/api/register', userDetails).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Registration successful');
        } else {
          alert('Registration failed');
        }
      },
      error: (error) => {
        console.error('Registration error', error);
        alert('An error occurred during registration');
      },
      complete: () => {
        console.log('Registration request completed');
      }
    });
  }

  reset() {
    this.submitted = false;
    this.regForm.reset();
  }
}
