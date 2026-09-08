import { Injectable } from '@angular/core';

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

  getStats(): DashboardStats {
    return {
      totalOrders: 128,
      ordersInProgress: 24,
      ordersCompleted: 96,
      ordersLate: 8,
      totalProducts: 65,
      lowStockProducts: 6,
      tasksInProgress: 15,
      tasksLate: 3,
    };
  }

  getRecentOrders(): RecentOrder[] {
    return [
      { orderNumber: 'CMD-0125', client: 'Amine Ben Salah', product: 'Chemise Homme', status: 'En production', deliveryDate: '12/09/2026' },
      { orderNumber: 'CMD-0124', client: 'Sarra Trabelsi', product: 'Robe Été', status: 'Nouvelle', deliveryDate: '15/09/2026' },
      { orderNumber: 'CMD-0123', client: 'Karim Jaziri', product: 'Veste Costume', status: 'Livrée', deliveryDate: '05/09/2026' },
      { orderNumber: 'CMD-0122', client: 'Nour Hammami', product: 'Pantalon', status: 'En retard', deliveryDate: '02/09/2026' },
      { orderNumber: 'CMD-0121', client: 'Yassine Ferjani', product: 'T-shirt Sport', status: 'Terminée', deliveryDate: '01/09/2026' },
    ];
  }

  getUpcomingTasks(): UpcomingTask[] {
    return [
      { title: 'Vérifier les mesures - CMD-0125', dueDate: '10/09/2026', priority: 'Haute' },
      { title: 'Couper le tissu - CMD-0124', dueDate: '11/09/2026', priority: 'Moyenne' },
      { title: 'Contrôle qualité - CMD-0123', dueDate: '09/09/2026', priority: 'Haute' },
    ];
  }

  getStockAlerts(): StockAlert[] {
    return [
      { productName: 'Tissu Coton Blanc', currentQuantity: 5, minQuantity: 20 },
      { productName: 'Fil Noir', currentQuantity: 8, minQuantity: 15 },
      { productName: 'Boutons Métal', currentQuantity: 12, minQuantity: 50 },
    ];
  }
}