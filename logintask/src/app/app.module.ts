import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RegisterComponent,
    LoginComponent,
    HttpClientModule,
    HomeComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
