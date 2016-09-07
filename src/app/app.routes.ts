import { Routes, RouterModule } from '@angular/router';
import { Home } from './home';
import { Login } from './login';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: 'login', component: Login },
  { path: '**',    redirectTo: '/home', pathMatch: 'full'},
];
