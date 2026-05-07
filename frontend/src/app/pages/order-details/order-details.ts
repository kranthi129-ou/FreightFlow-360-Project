import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {
  order?: Order;
  selectedStatus = '';

  allowedStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'CANCELLED'];

  loading = false;
  updatingStatus = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'Order ID is missing.';
      return;
    }

    const orderId = Number(idParam);

    if (Number.isNaN(orderId)) {
      this.errorMessage = 'Invalid order ID.';
      return;
    }

    this.loadOrder(orderId);
  }

  loadOrder(orderId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.orderService.getOrderById(orderId)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (order) => {
          this.order = {
            ...order,
            items: order.items ?? []
          };

          this.selectedStatus = order.status;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Load order details error:', error);
          this.errorMessage = 'Unable to load order details. Check that the backend is running on port 8082 and the order exists.';
          this.cdr.detectChanges();
        }
      });
  }

  updateStatus(): void {
    if (!this.order?.id) {
      return;
    }

    if (!this.selectedStatus) {
      this.errorMessage = 'Select a valid order status.';
      return;
    }

    this.updatingStatus = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.orderService.updateOrderStatus(this.order.id, this.selectedStatus)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.updatingStatus = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (updatedOrder) => {
          this.order = {
            ...updatedOrder,
            items: updatedOrder.items ?? this.order?.items ?? []
          };

          this.selectedStatus = this.order.status;
          this.successMessage = 'Order status updated successfully.';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Update order status error:', error);
          this.errorMessage = 'Unable to update order status.';
          this.cdr.detectChanges();
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'pending';
      case 'PROCESSING':
        return 'processing';
      case 'SHIPPED':
        return 'shipped';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return 'default';
    }
  }
}