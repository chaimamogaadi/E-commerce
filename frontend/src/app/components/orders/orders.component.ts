import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderItem } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <h2>My Orders</h2>

      @if (loading()) {
        <p class="info">Loading orders...</p>
      } @else if (orders().length === 0) {
        <p class="info">You have no orders yet.</p>
      } @else {
        <div class="orders-list">
          @for (order of orders(); track order.id) {
            <div class="order-card">
              <div class="order-header">
                <div>
                  <span class="order-id">#{{ order.id }}</span>
                  <span class="order-date">{{ order.createdAt | date:'medium' }}</span>
                </div>
                <div class="right-meta">
                  <span class="status-badge" [class]="'status-' + order.status.toLowerCase()">
                    {{ order.status }}
                  </span>
                  <span class="order-total">€{{ order.totalAmount | number:'1.2-2' }}</span>
                </div>
              </div>

              <div class="order-items">
                @for (item of parseItems(order); track item.productId) {
                  <div class="order-item">
                    <span class="item-name">{{ item.productName }}</span>
                    <span class="item-qty">× {{ item.quantity }}</span>
                    <span class="item-sub">€{{ item.subtotal | number:'1.2-2' }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-page { max-width: 800px; margin: 0 auto; }
    h2 { color: #1a1a2e; margin-bottom: 24px; }
    .info { color: #aaa; text-align: center; padding: 40px; }
    .orders-list { display: flex; flex-direction: column; gap: 20px; }
    .order-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .order-id { font-weight: 700; color: #1a1a2e; margin-right: 12px; }
    .order-date { color: #aaa; font-size: 0.85rem; }
    .right-meta { display: flex; align-items: center; gap: 16px; }
    .status-badge {
      padding: 3px 12px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .status-confirmed  { background: #e8f5e9; color: #2e7d32; }
    .status-pending    { background: #fff8e1; color: #f57f17; }
    .status-shipped    { background: #e3f2fd; color: #1565c0; }
    .status-delivered  { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled  { background: #ffebee; color: #b71c1c; }
    .order-total { font-weight: 700; color: #e94560; font-size: 1.1rem; }
    .order-items { border-top: 1px solid #f5f5f5; padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
    .order-item { display: flex; gap: 12px; align-items: center; }
    .item-name { flex: 1; color: #444; font-size: 0.9rem; }
    .item-qty { color: #aaa; font-size: 0.85rem; }
    .item-sub { font-weight: 600; color: #1a1a2e; font-size: 0.9rem; }
  `]
})
export class OrdersComponent implements OnInit {
  orders  = signal<Order[]>([]);
  loading = signal(true);

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: data => { this.orders.set(data); this.loading.set(false); },
      error: ()   => this.loading.set(false)
    });
  }

  parseItems(order: Order): OrderItem[] {
    try {
      return JSON.parse(order.itemsSnapshot);
    } catch {
      return [];
    }
  }
}