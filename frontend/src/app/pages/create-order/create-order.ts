import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CreateOrderRequest, OrderService } from '../../services/order.service';

interface SelectedOrderItem {
  productId: number;
  productName: string;
  availableQuantity: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

@Component({
  selector: 'app-create-order',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css'
})
export class CreateOrder implements OnInit {
  products: Product[] = [];
  selectedItems: SelectedOrderItem[] = [];

  customerName = '';
  customerEmail = '';

  selectedProductId: number | null = null;
  selectedQuantity = 1;

  loadingProducts = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.productService.getProducts()
      .pipe(
        timeout(8000),
        finalize(() => {
          this.loadingProducts = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (products) => {
          this.products = products ?? [];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Load products error:', error);
          this.errorMessage = 'Unable to load products for order creation.';
          this.cdr.detectChanges();
        }
      });
  }

  addItem(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedProductId) {
      this.errorMessage = 'Select a product.';
      return;
    }

    if (!this.selectedQuantity || this.selectedQuantity <= 0) {
      this.errorMessage = 'Quantity must be greater than zero.';
      return;
    }

    const product = this.products.find((item) => item.id === Number(this.selectedProductId));

    if (!product || !product.id) {
      this.errorMessage = 'Selected product was not found.';
      return;
    }

    if (this.selectedItems.some((item) => item.productId === product.id)) {
      this.errorMessage = 'This product is already added to the order.';
      return;
    }

    if (this.selectedQuantity > product.quantity) {
      this.errorMessage = `Quantity cannot exceed available stock (${product.quantity}).`;
      return;
    }

    this.selectedItems.push({
      productId: product.id,
      productName: product.name,
      availableQuantity: product.quantity,
      quantity: this.selectedQuantity,
      unitPrice: product.unitPrice,
      subtotal: this.selectedQuantity * product.unitPrice
    });

    this.selectedProductId = null;
    this.selectedQuantity = 1;
    this.cdr.detectChanges();
  }

  removeItem(productId: number): void {
    this.selectedItems = this.selectedItems.filter((item) => item.productId !== productId);
    this.cdr.detectChanges();
  }

  getTotalAmount(): number {
    return this.selectedItems.reduce((total, item) => total + item.subtotal, 0);
  }

  submitOrder(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.customerName.trim()) {
      this.errorMessage = 'Customer name is required.';
      return;
    }

    if (this.selectedItems.length === 0) {
      this.errorMessage = 'Add at least one product to the order.';
      return;
    }

    const orderRequest: CreateOrderRequest = {
      customerName: this.customerName.trim(),
      customerEmail: this.customerEmail.trim() || undefined,
      items: this.selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.saving = true;
    this.cdr.detectChanges();

    this.orderService.createOrder(orderRequest)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (order) => {
          this.successMessage = 'Order created successfully.';
          this.cdr.detectChanges();

          if (order.id) {
            this.router.navigate(['/app/orders', order.id]);
            return;
          }

          this.router.navigate(['/app/orders']);
        },
        error: (error) => {
          console.error('Create order error:', error);
          this.errorMessage = 'Visitor can’t create orders. Please reach out to Kranthi to get admin access.';
          this.cdr.detectChanges();
        }
      });
  }
}