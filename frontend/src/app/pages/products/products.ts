import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: Product[] = [];
  searchKeyword = '';
  loading = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.productService.getProducts()
      .pipe(
        timeout(8000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.products = data;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Load products error:', error);
          this.errorMessage = 'Unable to load products. Check that the backend is running on port 8081 and /api/products is working.';
          this.cdr.detectChanges();
        }
      });
  }

  searchProducts(): void {
    const keyword = this.searchKeyword.trim();

    if (!keyword) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.productService.searchProducts(keyword)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.products = data;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Search products error:', error);
          this.errorMessage = 'Unable to search products.';
          this.cdr.detectChanges();
        }
      });
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    if (!product.id) {
      return;
    }

    const confirmed = confirm(`Delete product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products = this.products.filter((item) => item.id !== product.id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Delete product error:', error);
        this.errorMessage = 'Unable to delete product. This product may already be used in an order.';
        this.cdr.detectChanges();
      }
          });
  }

  isLowStock(product: Product): boolean {
    return product.quantity <= product.reorderLevel;
  }
}