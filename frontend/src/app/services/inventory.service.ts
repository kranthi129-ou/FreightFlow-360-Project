import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly apiUrl = 'http://localhost:8082/api/inventory';
  private readonly productApiUrl = 'http://localhost:8082/api/products';

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

