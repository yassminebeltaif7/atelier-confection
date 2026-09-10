import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductCategory } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm = '';
  selectedCategory = 'Toutes';

  categories: ProductCategory[] = ['Chemise', 'Pantalon', 'Veste', 'T-shirt', 'Accessoire', 'Autre'];

  showModal = false;
  isEditMode = false;
  currentProduct: Omit<Product, 'id'> = {
    nom: '', reference: '', categorie: 'Chemise', taille: '', couleur: '', quantite: 0, stockMinimum: 0
  };
  editingId: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Erreur chargement produits:', err)
    });
  }

  get filteredProducts(): Product[] {
    let result = this.products;

    if (this.selectedCategory !== 'Toutes') {
      result = result.filter(p => p.categorie === this.selectedCategory);
    }

    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(p =>
        p.nom.toLowerCase().includes(term) ||
        p.reference.toLowerCase().includes(term)
      );
    }

    return result;
  }

  getStockLevel(product: Product): 'normal' | 'low' | 'out' {
    return this.productService.getStockLevel(product);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.currentProduct = { nom: '', reference: '', categorie: 'Chemise', taille: '', couleur: '', quantite: 0, stockMinimum: 0 };
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.editingId = product.id;
    this.currentProduct = {
      nom: product.nom,
      reference: product.reference,
      categorie: product.categorie,
      taille: product.taille,
      couleur: product.couleur,
      quantite: product.quantite,
      stockMinimum: product.stockMinimum,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveProduct(): void {
    if (!this.currentProduct.nom || !this.currentProduct.reference) {
      return;
    }

    if (this.isEditMode && this.editingId !== null) {
      this.productService.update(this.editingId, this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => console.error('Erreur modification produit:', err)
      });
    } else {
      this.productService.add(this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => console.error('Erreur ajout produit:', err)
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.delete(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Erreur suppression produit:', err)
      });
    }
  }
}