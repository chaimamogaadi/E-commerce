import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-page">
      <h2>Your Cart</h2>

      @if (loading()) {
        <p class="info">Loading cart...</p>
      } @else if (items().length === 0) {
        <div class="empty-cart">
          <p>Your cart is empty.</p>
          <button class="btn-primary" (click)="router.navigate(['/products'])">Browse products</button>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-items">
            @for (item of items(); track item.id) {
              <div class="cart-item">
                <img [src]="item.product.imageUrl || 'https://via.placeholder.com/80x80'"
                     [alt]="item.product.name" class="item-img" />
                <div class="item-details">
                  <h4>{{ item.product.name }}</h4>
                  <p class="item-price">€{{ item.product.price | number:'1.2-2' }} each</p>
                </div>
                <div class="qty-controls">
                  <button (click)="changeQty(item, item.quantity - 1)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="changeQty(item, item.quantity + 1)">+</button>
                </div>
                <p class="item-subtotal">€{{ (item.product.price * item.quantity) | number:'1.2-2' }}</p>
                <button class="btn-remove" (click)="remove(item)">Remove</button>
              </div>
            }
          </div>

          <div class="order-summary">
            <h3>Order summary</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>€{{ total() | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div class="summary-row total-row">
              <span>Total</span>
              <span>€{{ total() | number:'1.2-2' }}</span>
            </div>
            <button
              class="btn-checkout"
              (click)="checkout()"
              [disabled]="checkingOut()"
            >
              {{ checkingOut() ? 'Processing...' : 'Place order' }}
            </button>
            @if (orderSuccess()) {
              <div class="success-msg">Order placed! Redirecting to orders...</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page { max-width: 1000px; margin: 0 auto; }
    h2 { color: #1a1a2e; margin-bottom: 24px; }
    .info { color: #aaa; }
    .empty-cart { text-align: center; padding: 60px; }
    .empty-cart p { color: #aaa; margin-bottom: 16px; }
    .cart-layout { display: flex; gap: 32px; align-items: flex-start; }
    .cart-items { flex: 1; display: flex; flex-direction: column; gap: 16px; }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .item-img { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; }
    .item-details { flex: 1; }
    .item-details h4 { margin: 0 0 4px; color: #1a1a2e; }
    .item-price { color: #888; font-size: 0.85rem; margin: 0; }
    .qty-controls { display: flex; align-items: center; gap: 10px; }
    .qty-controls button {
      width: 28px; height: 28px;
      border: 1.5px solid #ddd;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      transition: all 0.2s;
    }
    .qty-controls button:hover { border-color: #e94560; color: #e94560; }
    .item-subtotal { font-weight: 700; color: #1a1a2e; min-width: 70px; text-align: right; }
    .btn-remove {
      background: transparent;
      border: none;
      color: #e94560;
      cursor: pointer;
      font-size: 0.82rem;
      text-decoration: underline;
    }
    .order-summary {
      width: 280px;
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .order-summary h3 { margin: 0 0 20px; color: #1a1a2e; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; color: #555; font-size: 0.9rem; }
    hr { border: none; border-top: 1px solid #f0f0f0; margin: 12px 0; }
    .total-row { font-weight: 700; color: #1a1a2e; font-size: 1rem; }
    .btn-checkout {
      width: 100%;
      padding: 12px;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
      transition: background 0.2s;
    }
    .btn-checkout:hover:not(:disabled) { background: #c73652; }
    .btn-checkout:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary {
      padding: 10px 24px;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
    }
    .success-msg {
      text-align: center;
      color: #2e7d32;
      font-size: 0.85rem;
      margin-top: 12px;
    }
  `]
})
export class CartComponent implements OnInit {
  items        = signal<CartItem[]>([]);
  loading      = signal(true);
  checkingOut  = signal(false);
  orderSuccess = signal(false);

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: ()   => this.loading.set(false)
    });
  }

  total(): number {
    return this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  changeQty(item: CartItem, newQty: number): void {
    if (newQty <= 0) { this.remove(item); return; }
    this.cartService.updateQuantity(item.id, newQty).subscribe(() => this.loadCart());
  }

  remove(item: CartItem): void {
    this.cartService.removeFromCart(item.id).subscribe(() => this.loadCart());
  }

  checkout(): void {
    this.checkingOut.set(true);
    this.orderService.checkout().subscribe({
      next: () => {
        this.orderSuccess.set(true);
        this.items.set([]);
        this.cartService.cartCount.set(0);
        setTimeout(() => this.router.navigate(['/orders']), 1800);
      },
      error: () => this.checkingOut.set(false)
    });
  }
}