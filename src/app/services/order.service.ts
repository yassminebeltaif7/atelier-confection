import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [
    { id: 1, numero: 'CMD-0125', client: 'Amine Ben Salah', produit: 'Chemise Homme', quantite: 3, taille: 'M', couleur: 'Blanc', dateCommande: '01/09/2026', dateLivraison: '12/09/2026', statut: 'En production' },
    { id: 2, numero: 'CMD-0124', client: 'Sarra Trabelsi', produit: 'Robe Été', quantite: 1, taille: 'S', couleur: 'Bleu', dateCommande: '03/09/2026', dateLivraison: '15/09/2026', statut: 'Nouvelle' },
    { id: 3, numero: 'CMD-0123', client: 'Karim Jaziri', produit: 'Veste Costume', quantite: 2, taille: 'L', couleur: 'Noir', dateCommande: '28/08/2026', dateLivraison: '05/09/2026', statut: 'Livrée' },
    { id: 4, numero: 'CMD-0122', client: 'Nour Hammami', produit: 'Pantalon', quantite: 4, taille: 'XL', couleur: 'Kaki', dateCommande: '25/08/2026', dateLivraison: '02/09/2026', statut: 'En préparation' },
    { id: 5, numero: 'CMD-0121', client: 'Yassine Ferjani', produit: 'T-shirt Sport', quantite: 5, taille: 'M', couleur: 'Gris', dateCommande: '20/08/2026', dateLivraison: '01/09/2026', statut: 'Terminée' },
  ];

  private nextId = 6;

  getAll(): Order[] {
    return this.orders;
  }

  add(order: Omit<Order, 'id'>): void {
    const newOrder: Order = { id: this.nextId++, ...order };
    this.orders.push(newOrder);
  }

  update(id: number, updatedOrder: Omit<Order, 'id'>): void {
    const index = this.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.orders[index] = { id, ...updatedOrder };
    }
  }

  delete(id: number): void {
    this.orders = this.orders.filter(o => o.id !== id);
  }

  // Convertit une date "JJ/MM/AAAA" en objet Date
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  isLate(order: Order): boolean {
    if (order.statut === 'Livrée' || order.statut === 'Annulée') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.parseDate(order.dateLivraison) < today;
  }

  isNearDeadline(order: Order): boolean {
    if (order.statut === 'Livrée' || order.statut === 'Annulée') return false;
    if (this.isLate(order)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveryDate = this.parseDate(order.dateLivraison);
    const diffDays = (deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  }
}