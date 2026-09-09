import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProductionComponent } from './pages/production/production.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { StockComponent } from './pages/stock/stock.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'products', component: ProductsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'orders', component: OrdersComponent },
      { path: 'production', component: ProductionComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'stock', component: StockComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];