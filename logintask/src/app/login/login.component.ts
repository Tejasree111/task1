import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { MaterialModule } from 'src/Material.Module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService) {
    this.loginForm = this.fb.group({
      type:['',Validators.required],
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
    this.loginService.login(loginData);
  }
 
}
