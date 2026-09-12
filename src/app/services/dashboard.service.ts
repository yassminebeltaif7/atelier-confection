import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalOrders: number;
  ordersInProgress: number;
  ordersCompleted: number;
  ordersLate: number;
  totalProducts: number;
  lowStockProducts: number;
  tasksInProgress: number;
  tasksLate: number;
}

export interface RecentOrder {
  orderNumber: string;
  client: string;
  product: string;
  status: string;
  deliveryDate: string;
}

export interface UpcomingTask {
  title: string;
  dueDate: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
}

export interface StockAlert {
  productName: string;
  currentQuantity: number;
  minQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.http.get<RecentOrder[]>(`${this.apiUrl}/recent-orders`);
  }

  getUpcomingTasks(): Observable<UpcomingTask[]> {
    return this.http.get<UpcomingTask[]>(`${this.apiUrl}/upcoming-tasks`);
  }

  getStockAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(`${this.apiUrl}/stock-alerts`);
  }
}