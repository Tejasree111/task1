import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [LoginComponent], // Declare only components, directives, and pipes here
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule, // Import the routing module
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule, // Import Angular Material modules here
  ],
  exports: [LoginComponent], // Export if this component needs to be used elsewhere
})
export class LoginModule {}
