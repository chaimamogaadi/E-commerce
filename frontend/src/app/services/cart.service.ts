import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private base = `${environment.apiUrl}/cart`;

  cartCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.base).pipe(
      tap(items => this.cartCount.set(
        items.reduce((sum, i) => sum + i.quantity, 0)
      ))
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.base}/add`, { productId, quantity }).pipe(
      tap(() => this.cartCount.update(c => c + quantity))
    );
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.base}/${cartItemId}`, { quantity });
  }

  removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${cartItemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.base}/clear`).pipe(
      tap(() => this.cartCount.set(0))
    );
  }
}