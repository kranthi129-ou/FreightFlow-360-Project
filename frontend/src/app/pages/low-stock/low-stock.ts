import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { Product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-low-stock',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './low-stock.html',
  styleUrl: './low-stock.css'
})
export class LowStock implements OnInit {
  lowStockProducts: Product[] = [];
  adjustmentQuantities: { [productId: number]: number | null } = {};

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLowStockProducts();
  }

  loadLowStockProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.inventoryService.getLowStockProducts()
      .pipe(
        timeout(8000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (products) => {
          this.lowStockProducts = products;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Low-stock API error:', error);
          this.errorMessage = 'Unable to load low-stock products.';
          this.cdr.detectChanges();
        }
      });
  }

  adjustStock(product: Product): void {
    if (!product.id) {
      return;
    }

    const quantityChange = Number(this.adjustmentQuantities[product.id]);

    if (!quantityChange || quantityChange <= 0) {
      this.errorMessage = 'Enter a stock adjustment greater than zero.';
      this.successMessage = '';
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.inventoryService.adjustStock(product.id, quantityChange).subscribe({
      next: () => {
        this.successMessage = `Stock updated for ${product.name}.`;
        this.adjustmentQuantities[product.id!] = null;
        this.loadLowStockProducts();
      },
      error: (error) => {
        console.error('Adjust stock error:', error);
        this.errorMessage = 'Unable to adjust stock.';
        this.cdr.detectChanges();
      }
    });
  }
}