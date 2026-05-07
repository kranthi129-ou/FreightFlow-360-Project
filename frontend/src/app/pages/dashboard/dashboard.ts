import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard-summary.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  summary?: DashboardSummary;
  loading = false;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadDashboardSummary();
  }

  loadDashboardSummary(): void {
    this.loading = true;
    this.errorMessage = '';
    this.summary = undefined;
    this.forceRefresh();

    this.dashboardService.getDashboardSummary()
      .pipe(
        timeout(8000),
        finalize(() => {
          this.zone.run(() => {
            this.loading = false;
            this.forceRefresh();
          });
        })
      )
      .subscribe({
        next: (data) => {
          this.zone.run(() => {
            this.summary = {
              totalProducts: data.totalProducts ?? 0,
              totalOrders: data.totalOrders ?? 0,
              lowStockCount: data.lowStockCount ?? 0,
              totalInventoryValue: data.totalInventoryValue ?? 0,
              recentOrders: data.recentOrders ?? []
            };

            this.forceRefresh();
          });
        },
        error: (error) => {
          console.error('Dashboard load error:', error);

          this.zone.run(() => {
            this.errorMessage = 'Unable to load dashboard data. Check that the backend is running on port 8081 and /api/dashboard/summary is working.';
            this.forceRefresh();
          });
        }
      });
  }

  private forceRefresh(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }
}