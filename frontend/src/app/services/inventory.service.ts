import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api-base';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly apiUrl = `${API_BASE_URL}/api/inventory`;
  private readonly productApiUrl = `${API_BASE_URL}/api/products`;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productApiUrl);
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productApiUrl).pipe(
      map((products) =>
        products.filter((product) => product.quantity <= product.reorderLevel)
      )
    );
  }

  adjustStock(productId: number, quantityChange: number): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${productId}/adjust`,
      {
        quantity: quantityChange,
        adjustmentType: 'INCREASE'
      }
    );
  }
}

