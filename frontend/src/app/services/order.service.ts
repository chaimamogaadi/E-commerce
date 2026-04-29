import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  checkout(): Observable<Order> {
  return this.http.post<Order>(`${this.base}/checkout`, {});
}

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }
}