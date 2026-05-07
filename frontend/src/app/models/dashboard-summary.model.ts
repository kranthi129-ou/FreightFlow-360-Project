import { Order } from './order.model';

export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  lowStockCount: number;
  totalInventoryValue: number;
  recentOrders: Order[];
}

