import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductFilter } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  filter(f: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    if (f.category) params = params.set('category', f.category);
    if (f.color)    params = params.set('color', f.color);
    if (f.maxPrice) params = params.set('maxPrice', f.maxPrice.toString());
    if (f.keyword)  params = params.set('keyword', f.keyword);
    return this.http.get<Product[]>(`${this.base}/filter`, { params });
  }
}