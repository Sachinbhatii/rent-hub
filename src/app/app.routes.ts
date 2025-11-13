import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then(m => m.Signup),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'create-post',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/create-post/create-post').then(m => m.CreatePost),
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/favorites/favorites').then(m => m.Favorites),
  },
  {
    path: 'view-details/:id',
    loadComponent: () => import('./pages/view-details/view-details').then(m => m.ViewDetails),
  },
  {
    path: 'about',
    loadComponent: () => import('./info/about/about').then(m => m.About),
  },
  {
    path: 'contact',
    loadComponent: () => import('./info/contact/contact').then(m => m.Contact),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./legal/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites').then(m => m.Favorites)
  },
  { path: '**', redirectTo: '/home' },

];
