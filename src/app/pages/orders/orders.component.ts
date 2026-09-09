import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../models/order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  searchTerm = '';
  selectedStatus = 'Tous';

  statuses: OrderStatus[] = ['Nouvelle', 'En préparation', 'En production', 'Terminée', 'Livrée', 'Annulée'];

  showModal = false;
  isEditMode = false;
  currentOrder: Omit<Order, 'id'> = {
    numero: '', client: '', produit: '', quantite: 1, taille: '', couleur: '',
    dateCommande: '', dateLivraison: '', statut: 'Nouvelle'
  };
  editingId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orders = this.orderService.getAll();
  }

  get filteredOrders(): Order[] {
    let result = this.orders;

    if (this.selectedStatus !== 'Tous') {
      result = result.filter(o => o.statut === this.selectedStatus);
    }

    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(o =>
        o.numero.toLowerCase().includes(term) ||
        o.client.toLowerCase().includes(term)
      );
    }

    return result;
  }

  isLate(order: Order): boolean {
    return this.orderService.isLate(order);
  }

  isNearDeadline(order: Order): boolean {
    return this.orderService.isNearDeadline(order);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Nouvelle': return 'status-new';
      case 'En préparation':
      case 'En production': return 'status-progress';
      case 'Terminée':
      case 'Livrée': return 'status-done';
      case 'Annulée': return 'status-cancelled';
      default: return '';
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.currentOrder = {
      numero: '', client: '', produit: '', quantite: 1, taille: '', couleur: '',
      dateCommande: '', dateLivraison: '', statut: 'Nouvelle'
    };
    this.showModal = true;
  }

  openEditModal(order: Order): void {
    this.isEditMode = true;
    this.editingId = order.id;
    this.currentOrder = {
      numero: order.numero,
      client: order.client,
      produit: order.produit,
      quantite: order.quantite,
      taille: order.taille,
      couleur: order.couleur,
      dateCommande: order.dateCommande,
      dateLivraison: order.dateLivraison,
      statut: order.statut,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveOrder(): void {
    if (!this.currentOrder.numero || !this.currentOrder.client) {
      return;
    }

    if (this.isEditMode && this.editingId !== null) {
      this.orderService.update(this.editingId, this.currentOrder);
    } else {
      this.orderService.add(this.currentOrder);
    }

    this.loadOrders();
    this.closeModal();
  }

  deleteOrder(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      this.orderService.delete(id);
      this.loadOrders();
    }
  }
}