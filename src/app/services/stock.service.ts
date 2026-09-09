import { Injectable } from '@angular/core';
import { StockItem, StockMovement, MovementType } from '../models/stock-item';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private items: StockItem[] = [
    { id: 1, nom: 'Tissu Coton Blanc', categorie: 'Tissus', quantite: 5, unite: 'm' },
    { id: 2, nom: 'Fil Noir', categorie: 'Fils', quantite: 8, unite: 'bobines' },
    { id: 3, nom: 'Boutons Métal', categorie: 'Boutons', quantite: 12, unite: 'unités' },
    { id: 4, nom: 'Fermeture Éclair 20cm', categorie: 'Fermetures', quantite: 40, unite: 'unités' },
    { id: 5, nom: 'Étiquettes Marque', categorie: 'Accessoires', quantite: 100, unite: 'unités' },
    { id: 6, nom: 'Chemise Homme (finie)', categorie: 'Produits finis', quantite: 45, unite: 'unités' },
  ];

  private movements: StockMovement[] = [
    { id: 1, itemId: 1, itemNom: 'Tissu Coton Blanc', type: 'Sortie', quantite: 10, date: '05/09/2026' },
    { id: 2, itemId: 3, itemNom: 'Boutons Métal', type: 'Entrée', quantite: 20, date: '03/09/2026' },
    { id: 3, itemId: 6, itemNom: 'Chemise Homme (finie)', type: 'Entrée', quantite: 45, date: '01/09/2026' },
  ];

  private nextItemId = 7;
  private nextMovementId = 4;

  getAllItems(): StockItem[] {
    return this.items;
  }

  getAllMovements(): StockMovement[] {
    return this.movements;
  }

  addItem(item: Omit<StockItem, 'id'>): void {
    const newItem: StockItem = { id: this.nextItemId++, ...item };
    this.items.push(newItem);
  }

  updateItem(id: number, updatedItem: Omit<StockItem, 'id'>): void {
    const index = this.items.findIndex(i => i.id === id);
    if (index !== -1) {
      this.items[index] = { id, ...updatedItem };
    }
  }

  deleteItem(id: number): void {
    this.items = this.items.filter(i => i.id !== id);
  }

  addMovement(itemId: number, type: MovementType, quantite: number, date: string): void {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    if (type === 'Entrée') {
      item.quantite += quantite;
    } else {
      item.quantite = Math.max(0, item.quantite - quantite);
    }

    this.movements.unshift({
      id: this.nextMovementId++,
      itemId,
      itemNom: item.nom,
      type,
      quantite,
      date,
    });
  }
}