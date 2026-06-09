import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'animais', loadComponent: () => import('./pages/animals/animals').then(m => m.AnimalsComponent) },
  { path: 'animais/:id', loadComponent: () => import('./pages/animal-detail/animal-detail').then(m => m.AnimalDetailComponent) },
  { path: 'auth/login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
  { path: 'auth/cadastrar', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'meus-animais', loadComponent: () => import('./pages/my-animals/my-animals').then(m => m.MyAnimalsComponent), canActivate: [authGuard] },
  { path: 'minhas-adocoes', loadComponent: () => import('./pages/my-adoptions/my-adoptions').then(m => m.MyAdoptionsComponent), canActivate: [authGuard] },
  { path: 'perfil', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
