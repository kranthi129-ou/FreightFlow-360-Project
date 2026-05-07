import { OrderItem } from './order-item.model';

export interface Order {
  id?: number;
  customerName: string;
  customerEmail?: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
}