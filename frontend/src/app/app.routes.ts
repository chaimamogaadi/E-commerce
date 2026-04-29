import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];