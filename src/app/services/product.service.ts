import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, nom: 'Chemise Homme Classique', reference: 'CH-001', categorie: 'Chemise', taille: 'M', couleur: 'Blanc', quantite: 45, stockMinimum: 15 },
    { id: 2, nom: 'Robe Été Fleurie', reference: 'RB-002', categorie: 'Autre', taille: 'S', couleur: 'Bleu', quantite: 8, stockMinimum: 10 },
    { id: 3, nom: 'Veste Costume Homme', reference: 'VS-003', categorie: 'Veste', taille: 'L', couleur: 'Noir', quantite: 0, stockMinimum: 5 },
    { id: 4, nom: 'Pantalon Cargo', reference: 'PT-004', categorie: 'Pantalon', taille: 'XL', couleur: 'Kaki', quantite: 30, stockMinimum: 10 },
    { id: 5, nom: 'T-shirt Sport', reference: 'TS-005', categorie: 'T-shirt', taille: 'M', couleur: 'Gris', quantite: 12, stockMinimum: 15 },
    { id: 6, nom: 'Ceinture Cuir', reference: 'AC-006', categorie: 'Accessoire', taille: 'Unique', couleur: 'Marron', quantite: 25, stockMinimum: 8 },
  ];

  private nextId = 7;

  getAll(): Product[] {
    return this.products;
  }

  add(product: Omit<Product, 'id'>): void {
    const newProduct: Product = { id: this.nextId++, ...product };
    this.products.push(newProduct);
  }

  update(id: number, updatedProduct: Omit<Product, 'id'>): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { id, ...updatedProduct };
    }
  }

  delete(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }

  getStockLevel(product: Product): 'normal' | 'low' | 'out' {
    if (product.quantite === 0) return 'out';
    if (product.quantite <= product.stockMinimum) return 'low';
    return 'normal';
  }
}