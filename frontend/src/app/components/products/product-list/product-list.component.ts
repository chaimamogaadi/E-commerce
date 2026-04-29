import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Product, ProductFilter } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-layout">

      <!-- Sidebar filters -->
      <aside class="filters">
        <h3>Filters</h3>

        <div class="filter-group">
          <label>Search</label>
          <input
            type="text"
            [(ngModel)]="filter.keyword"
            (ngModelChange)="applyFilters()"
            placeholder="Search products..."
          />
        </div>

        <div class="filter-group">
          <label>Category</label>
          <select [(ngModel)]="filter.category" (ngModelChange)="applyFilters()">
            <option value="">All categories</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Color</label>
          <select [(ngModel)]="filter.color" (ngModelChange)="applyFilters()">
            <option value="">All colors</option>
            @for (col of colors; track col) {
              <option [value]="col">{{ col }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Max price (€)</label>
          <input
            type="number"
            [(ngModel)]="filter.maxPrice"
            (ngModelChange)="applyFilters()"
            placeholder="e.g. 50"
            min="0"
          />
        </div>

        <button class="btn-reset" (click)="resetFilters()">Reset filters</button>
      </aside>

      <!-- Product grid -->
      <section class="product-area">
        <div class="results-bar">
          <span>{{ products().length }} products found</span>
        </div>

        @if (loading()) {
          <div class="loading">Loading products...</div>
        } @else if (products().length === 0) {
          <div class="empty-state">No products match your filters.</div>
        } @else {
          <div class="product-grid">
            @for (product of products(); track product.id) {
              <div class="product-card">
                <div class="product-image">
                  <img [src]="product.imageUrl || 'https://placehold.co/300x200?text=' + product.name"
                       [alt]="product.name"
                       onerror="this.src='https://placehold.co/300x200?text=Product'"/>
                </div>
                <div class="product-info">
                  <span class="category-tag">{{ product.category }}</span>
                  <h4>{{ product.name }}</h4>
                  <p class="description">{{ product.description }}</p>
                  <div class="meta">
                    @if (product.color) {
                      <span class="tag">{{ product.color }}</span>
                    }
                    @if (product.brand) {
                      <span class="tag">{{ product.brand }}</span>
                    }
                  </div>
                  <div class="card-footer">
                    <span class="price">€{{ product.price | number:'1.2-2' }}</span>
                    @if (product.stock > 0) {
                      <button
                        class="btn-add"
                        (click)="addToCart(product)"
                        [disabled]="!auth.isLoggedIn()"
                        [title]="auth.isLoggedIn() ? '' : 'Login to add to cart'"
                      >
                        Add to cart
                      </button>
                    } @else {
                      <span class="out-of-stock">Out of stock</span>
                    }
                  </div>
                  @if (addedProductId() === product.id) {
                    <div class="added-toast">Added to cart!</div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .page-layout { display: flex; gap: 24px; }
    .filters {
      width: 220px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      height: fit-content;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .filters h3 { margin: 0 0 16px; font-size: 1rem; color: #1a1a2e; }
    .filter-group { margin-bottom: 16px; }
    .filter-group label { display: block; font-size: 0.8rem; font-weight: 600; color: #666; margin-bottom: 6px; }
    .filter-group input, .filter-group select {
      width: 100%;
      padding: 8px 10px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .filter-group input:focus, .filter-group select:focus { border-color: #e94560; }
    .btn-reset {
      width: 100%;
      padding: 8px;
      background: transparent;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      color: #666;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-reset:hover { border-color: #e94560; color: #e94560; }
    .product-area { flex: 1; }
    .results-bar { color: #888; font-size: 0.85rem; margin-bottom: 16px; }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }
    .product-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    }
    .product-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .product-image { height: 180px; overflow: hidden; background: #f5f5f5; }
    .product-image img { width: 100%; height: 100%; object-fit: cover; }
    .product-info { padding: 14px; }
    .category-tag {
      display: inline-block;
      background: #f0f0f0;
      color: #666;
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 20px;
      margin-bottom: 8px;
    }
    h4 { margin: 0 0 6px; font-size: 1rem; color: #1a1a2e; }
    .description { color: #888; font-size: 0.82rem; margin: 0 0 8px; line-height: 1.4; }
    .meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
    .tag {
      background: #eef2ff;
      color: #5c6bc0;
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 20px;
    }
    .card-footer { display: flex; align-items: center; justify-content: space-between; }
    .price { font-size: 1.2rem; font-weight: 700; color: #e94560; }
    .btn-add {
      background: #1a1a2e;
      color: #fff;
      border: none;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-add:hover:not(:disabled) { background: #e94560; }
    .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
    .out-of-stock { color: #bbb; font-size: 0.82rem; }
    .added-toast {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a2e;
      color: #fff;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 0.78rem;
    }
    .loading, .empty-state { text-align: center; color: #aaa; padding: 60px 0; }
  `]
})
export class ProductListComponent implements OnInit {
  products     = signal<Product[]>([]);
  loading      = signal(true);
  addedProductId = signal<number | null>(null);

  filter: ProductFilter = {};

  categories = ['Jackets', 'Hoodies', 'Shoes', 'Pants', 'T-Shirts', 'Sweaters', 'Dresses', 'Suits'];
  colors     = ['Blue', 'Red', 'Black', 'White', 'Green', 'Grey', 'Brown', 'Pink', 'Navy'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.loading.set(true);
    const hasFilter = this.filter.category || this.filter.color || this.filter.maxPrice || this.filter.keyword;
    const request$ = hasFilter
      ? this.productService.filter(this.filter)
      : this.productService.getAll();

    request$.subscribe({
      next: data => { this.products.set(data); this.loading.set(false); },
      error: ()   => this.loading.set(false)
    });
  }

  resetFilters(): void {
    this.filter = {};
    this.applyFilters();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.addedProductId.set(product.id);
        setTimeout(() => this.addedProductId.set(null), 1500);
      }
    });
  }
}