import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/Material.Module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { passwordValidator } from './password-validator';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  isEditMode: boolean = false; // To check if it's edit mode
  userId: number | null = null; // For identifying user in edit mode
  passwordMismatch: boolean = false; //variable to track password mismatch

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router:Router,
    private route: ActivatedRoute
  ) {
    this.regForm = this.fb.group(
      {
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), passwordValidator()]],
        cPassword: ['', Validators.required],
        type:['',Validators.required],
        image:[''],
      },
      //{validators: this.passwordMatchValidator,}
    );
  }

 /* passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const cPassword = form.get('cPassword')?.value;
    if (password !== cPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }*/

  ngOnInit(): void {
  


    this.route.queryParams.subscribe((params) => {
      if (params['Id']) {
        this.isEditMode = true;
        this.userId = +params['Id'];

        // Load user data into form for editing
        this.regForm.patchValue({
          fname: params['fname'],
          lname: params['lname'],
          email: params['email'],
        });

        // Disable email and hide password fields in edit mode
        this.regForm.get('email')?.disable();
        this.regForm.get('type')?.clearValidators();
        this.regForm.get('type')?.updateValueAndValidity();
        this.regForm.get('password')?.clearValidators();
        this.regForm.get('password')?.updateValueAndValidity();
        this.regForm.get('cPassword')?.clearValidators();
        this.regForm.get('cPassword')?.updateValueAndValidity();
      }
    });

    // Listen to changes in password and confirm password fields
    this.regForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordMismatch();
    });

    this.regForm.get('cPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMismatch();
    });
  
  }

  checkPasswordMismatch(): void {
    const password = this.regForm.get('password')?.value;
    const cPassword = this.regForm.get('cPassword')?.value;
    this.passwordMismatch = password !== cPassword; // Set mismatch state
  }

uploadedFileName: string | null = null;

onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    //this.uploadedFileName = file.name;
    const reader =new FileReader();
    reader.onloadend=()=>{
           this.uploadedFileName=reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}


  submit(): void {
    console.log("Form submitted")
    console.log(this.regForm.valid);
    console.log(this.regForm)
    if (this.regForm.invalid) return;
  
    const formData = this.regForm.getRawValue(); // Includes disabled fields
    formData.image=this.uploadedFileName;

    if (this.isEditMode && this.userId) {
      // Update user details
      const token = localStorage.getItem('token');
      if (token) {
        this.http
          .patch<{ success: boolean }>(
            `http://localhost:3000/api/user/${this.userId}`,
            {
              fname: formData.fname,
              lname: formData.lname,
            },
            //{ headers: { Authorization: `Bearer ${token}` } }
          )
          .subscribe({
            next: (response) => {
              if (response.success) {
                alert('User details updated successfully!');
                this.router.navigate(['/home']); // Navigate back to home
              }
            },
            error: (err) => {
              console.error('Error updating user details:', err);
            },
          });
      }
    } else {
      // Registration logic
      this.http
        .post<{ success: boolean }>('http://localhost:3000/api/register', formData)
        .subscribe({
          next: (response) => {
            if (response.success) {
              //alert('Registration successful!');
              this.router.navigate(['/login']); // Navigate to login page
            }
          },
          error: (err) => {
            console.error('Error during registration:', err);
          },
        });
    }
  }

  /*
  submit() {
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
      password: this.regForm.get('password')?.value,
    };

    this.http
      .post<{ success: boolean; message: string }>(
        'http://localhost:3000/api/register',
        userDetails
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            //alert('Registration successful');
            //window.location.href = '/login';
            this.router.navigate(['/login']);
            
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
        },
      });
  }

 

  reset() {
    this.regForm.reset();
  }
  */

  
}
