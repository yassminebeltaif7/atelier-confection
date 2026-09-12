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
  stats: DashboardStats = {
    totalOrders: 0, ordersInProgress: 0, ordersCompleted: 0, ordersLate: 0,
    totalProducts: 0, lowStockProducts: 0, tasksInProgress: 0, tasksLate: 0
  };
  recentOrders: RecentOrder[] = [];
  upcomingTasks: UpcomingTask[] = [];
  stockAlerts: StockAlert[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Erreur chargement stats:', err)
    });

    this.dashboardService.getRecentOrders().subscribe({
      next: (data) => this.recentOrders = data,
      error: (err) => console.error('Erreur chargement commandes récentes:', err)
    });

    this.dashboardService.getUpcomingTasks().subscribe({
      next: (data) => this.upcomingTasks = data,
      error: (err) => console.error('Erreur chargement tâches à venir:', err)
    });

    this.dashboardService.getStockAlerts().subscribe({
      next: (data) => this.stockAlerts = data,
      error: (err) => console.error('Erreur chargement alertes stock:', err)
    });
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