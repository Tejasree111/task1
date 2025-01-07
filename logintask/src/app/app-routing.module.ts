import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginGuard } from './guards/login.guard';


const routes: Routes = [
  //{ path : '',component : RegisterComponent},
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard] },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  { path: 'register', component: RegisterComponent },
  { path: 'edit-user', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: '**', redirectTo: 'register' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
