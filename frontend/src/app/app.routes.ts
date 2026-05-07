import { Routes } from '@angular/router';

import { Layout } from './shared/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Products } from './pages/products/products';
import { ProductForm } from './pages/product-form/product-form';
import { Orders } from './pages/orders/orders';
import { CreateOrder } from './pages/create-order/create-order';
import { OrderDetails } from './pages/order-details/order-details';
import { LowStock } from './pages/low-stock/low-stock';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'products/new', component: ProductForm },
      { path: 'products/edit/:id', component: ProductForm },
      { path: 'orders', component: Orders },
      { path: 'orders/create', component: CreateOrder },
      { path: 'orders/:id', component: OrderDetails },
      { path: 'low-stock', component: LowStock }
    ]
  }
];