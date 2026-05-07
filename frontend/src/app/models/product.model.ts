export interface Product {
  id?: number;
  name: string;
  sku: string;
  category: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  createdAt?: string;
  updatedAt?: string;
}