import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockItem, StockMovement, StockCategory, MovementType } from '../../models/stock-item';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {
  items: StockItem[] = [];
  movements: StockMovement[] = [];
  searchTerm = '';
  selectedCategory = 'Toutes';
  activeTab: 'items' | 'history' = 'items';

  categories: StockCategory[] = ['Tissus', 'Fils', 'Boutons', 'Fermetures', 'Accessoires', 'Produits finis'];

  showItemModal = false;
  isEditMode = false;
  currentItem: Omit<StockItem, 'id'> = { nom: '', categorie: 'Tissus', quantite: 0, unite: '' };
  editingId: number | null = null;

  showMovementModal = false;
  movementItemId: number | null = null;
  movementType: MovementType = 'Entrée';
  movementQuantity = 1;
  movementDate = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.items = this.stockService.getAllItems();
    this.movements = this.stockService.getAllMovements();
  }

  get filteredItems(): StockItem[] {
    let result = this.items;

    if (this.selectedCategory !== 'Toutes') {
      result = result.filter(i => i.categorie === this.selectedCategory);
    }

    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(i => i.nom.toLowerCase().includes(term));
    }

    return result;
  }

  // Gestion des articles
  openAddItemModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.currentItem = { nom: '', categorie: 'Tissus', quantite: 0, unite: '' };
    this.showItemModal = true;
  }

  openEditItemModal(item: StockItem): void {
    this.isEditMode = true;
    this.editingId = item.id;
    this.currentItem = { nom: item.nom, categorie: item.categorie, quantite: item.quantite, unite: item.unite };
    this.showItemModal = true;
  }

  closeItemModal(): void {
    this.showItemModal = false;
  }

  saveItem(): void {
    if (!this.currentItem.nom) return;

    if (this.isEditMode && this.editingId !== null) {
      this.stockService.updateItem(this.editingId, this.currentItem);
    } else {
      this.stockService.addItem(this.currentItem);
    }

    this.loadData();
    this.closeItemModal();
  }

  deleteItem(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      this.stockService.deleteItem(id);
      this.loadData();
    }
  }

  // Gestion des mouvements (entrée/sortie)
  openMovementModal(item: StockItem, type: MovementType): void {
    this.movementItemId = item.id;
    this.movementType = type;
    this.movementQuantity = 1;
    this.movementDate = new Date().toLocaleDateString('fr-FR');
    this.showMovementModal = true;
  }

  closeMovementModal(): void {
    this.showMovementModal = false;
  }

  saveMovement(): void {
    if (this.movementItemId === null || this.movementQuantity <= 0) return;

    this.stockService.addMovement(this.movementItemId, this.movementType, this.movementQuantity, this.movementDate);
    this.loadData();
    this.closeMovementModal();
  }
}