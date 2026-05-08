import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: Order[] = [];
  loading = false;
  errorMessage = '';
  showVisitorPopup = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.orderService.getOrders()
      .pipe(
        timeout(8000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.orders = data ?? [];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Load orders error:', error);
          this.errorMessage = 'Unable to load orders. Check that the backend is running on port 8082 and /api/orders is working.';
          this.cdr.detectChanges();
        }
      });
  }

  handleCreateOrder(): void {
    if (this.isVisitorAccount()) {
      this.showVisitorPopup = true;
      return;
    }

    this.router.navigate(['/app/orders/create']);
  }

  closeVisitorPopup(): void {
    this.showVisitorPopup = false;
  }

  private isVisitorAccount(): boolean {
    const role =
      localStorage.getItem('role') ||
      localStorage.getItem('adminRole') ||
      localStorage.getItem('userRole');

    const email =
      localStorage.getItem('email') ||
      localStorage.getItem('adminEmail') ||
      localStorage.getItem('userEmail');

    if (role && role.toUpperCase() === 'VIEWER') {
      return true;
    }

    if (email && email.toLowerCase() === 'visitor@freightflow360.com') {
      return true;
    }

    const possibleKeys = ['auth', 'adminAuth', 'currentUser', 'user'];

    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);

      if (!value) {
        continue;
      }

      try {
        const parsed = JSON.parse(value);
        const savedRole = parsed?.role || parsed?.user?.role || parsed?.admin?.role;
        const savedEmail = parsed?.email || parsed?.user?.email || parsed?.admin?.email;

        if (savedRole && savedRole.toUpperCase() === 'VIEWER') {
          return true;
        }

        if (savedEmail && savedEmail.toLowerCase() === 'visitor@freightflow360.com') {
          return true;
        }
      } catch {
        continue;
      }
    }

    return false;
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