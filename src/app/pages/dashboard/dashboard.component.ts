import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardService,
  DashboardStats,
  RecentOrder,
  UpcomingTask,
  StockAlert,
} from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats!: DashboardStats;
  recentOrders: RecentOrder[] = [];
  upcomingTasks: UpcomingTask[] = [];
  stockAlerts: StockAlert[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.stats = this.dashboardService.getStats();
    this.recentOrders = this.dashboardService.getRecentOrders();
    this.upcomingTasks = this.dashboardService.getUpcomingTasks();
    this.stockAlerts = this.dashboardService.getStockAlerts();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En retard': return 'status-late';
      case 'Livrée':
      case 'Terminée': return 'status-done';
      case 'Nouvelle': return 'status-new';
      default: return 'status-progress';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Haute': return 'priority-high';
      case 'Moyenne': return 'priority-medium';
      default: return 'priority-low';
    }
  }
}