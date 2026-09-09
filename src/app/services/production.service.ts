import { Injectable } from '@angular/core';
import { Production, ProductionStage } from '../models/production';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  stages: ProductionStage[] = [
    'Nouvelle', 'Préparation', 'Coupe', 'Couture', 'Contrôle qualité', 'Emballage', 'Terminée'
  ];

  private productions: Production[] = [
    { id: 1, commandeNumero: 'CMD-0125', produit: 'Chemise Homme', quantite: 3, etapeActuelle: 'Couture', dateDebut: '02/09/2026', datePrevueFin: '11/09/2026' },
    { id: 2, commandeNumero: 'CMD-0124', produit: 'Robe Été', quantite: 1, etapeActuelle: 'Nouvelle', dateDebut: '04/09/2026', datePrevueFin: '14/09/2026' },
    { id: 3, commandeNumero: 'CMD-0122', produit: 'Pantalon', quantite: 4, etapeActuelle: 'Contrôle qualité', dateDebut: '26/08/2026', datePrevueFin: '01/09/2026' },
    { id: 4, commandeNumero: 'CMD-0126', produit: 'Veste Sport', quantite: 2, etapeActuelle: 'Coupe', dateDebut: '05/09/2026', datePrevueFin: '13/09/2026' },
    { id: 5, commandeNumero: 'CMD-0121', produit: 'T-shirt Sport', quantite: 5, etapeActuelle: 'Terminée', dateDebut: '21/08/2026', datePrevueFin: '31/08/2026' },
  ];

  private nextId = 6;

  getAll(): Production[] {
    return this.productions;
  }

  add(production: Omit<Production, 'id'>): void {
    const newProd: Production = { id: this.nextId++, ...production };
    this.productions.push(newProd);
  }

  update(id: number, updatedProd: Omit<Production, 'id'>): void {
    const index = this.productions.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productions[index] = { id, ...updatedProd };
    }
  }

  delete(id: number): void {
    this.productions = this.productions.filter(p => p.id !== id);
  }

  moveToNextStage(id: number): void {
    const prod = this.productions.find(p => p.id === id);
    if (!prod) return;
    const currentIndex = this.stages.indexOf(prod.etapeActuelle);
    if (currentIndex < this.stages.length - 1) {
      prod.etapeActuelle = this.stages[currentIndex + 1];
    }
  }

  moveToPreviousStage(id: number): void {
    const prod = this.productions.find(p => p.id === id);
    if (!prod) return;
    const currentIndex = this.stages.indexOf(prod.etapeActuelle);
    if (currentIndex > 0) {
      prod.etapeActuelle = this.stages[currentIndex - 1];
    }
  }
}