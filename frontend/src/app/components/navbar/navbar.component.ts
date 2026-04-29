import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <a routerLink="/products" class="brand">ShopSmart</a>

      <div class="nav-links">
        <a routerLink="/products" routerLinkActive="active">Products</a>

        @if (auth.isLoggedIn()) {
          <a routerLink="/cart" routerLinkActive="active" class="cart-link">
            Cart
            @if (cartCount() > 0) {
              <span class="badge">{{ cartCount() }}</span>
            }
          </a>
          <a routerLink="/orders" routerLinkActive="active">Orders</a>
          <span class="user-name">{{ auth.currentUser()?.fullName }}</span>
          <button class="btn-logout" (click)="auth.logout()">Logout</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" routerLinkActive="active">Register</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 60px;
      background: #1a1a2e;
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      font-size: 1.4rem;
      font-weight: 700;
      color: #e94560;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-links a {
      color: #ccc;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #fff; }
    .cart-link { position: relative; }
    .badge {
      position: absolute;
      top: -8px;
      right: -10px;
      background: #e94560;
      color: #fff;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-name { color: #aaa; font-size: 0.85rem; }
    .btn-logout {
      background: transparent;
      border: 1px solid #e94560;
      color: #e94560;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-logout:hover { background: #e94560; color: #fff; }
  `]
})
export class NavbarComponent {
  cartCount!: () => number;

  constructor(public auth: AuthService, private cartService: CartService) {
    this.cartCount = this.cartService.cartCount.bind(this.cartService);
  }
}