import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Production, ProductionStage } from '../../models/production';
import { ProductionService } from '../../services/production.service';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production.component.html',
  styleUrl: './production.component.css'
})
export class ProductionComponent implements OnInit {
  productions: Production[] = [];
  stages: ProductionStage[] = [];

  showModal = false;
  isEditMode = false;
  currentProduction: Omit<Production, 'id'> = {
    commandeNumero: '', produit: '', quantite: 1, etapeActuelle: 'Nouvelle', dateDebut: '', datePrevueFin: ''
  };
  editingId: number | null = null;

  constructor(private productionService: ProductionService) {}

  ngOnInit(): void {
    this.stages = this.productionService.stages;
    this.loadProductions();
  }

  loadProductions(): void {
    this.productionService.getAll().subscribe({
      next: (data) => this.productions = data,
      error: (err) => console.error('Erreur chargement productions:', err)
    });
  }

  getByStage(stage: ProductionStage): Production[] {
    return this.productions.filter(p => p.etapeActuelle === stage);
  }

  moveNext(production: Production): void {
    const nextStage = this.productionService.getNextStage(production.etapeActuelle);
    if (!nextStage) return;

    const updated = { ...production, etapeActuelle: nextStage };
    const { id, ...data } = updated;

    this.productionService.update(production.id, data).subscribe({
      next: () => this.loadProductions(),
      error: (err) => console.error('Erreur déplacement production:', err)
    });
  }

  movePrevious(production: Production): void {
    const prevStage = this.productionService.getPreviousStage(production.etapeActuelle);
    if (!prevStage) return;

    const updated = { ...production, etapeActuelle: prevStage };
    const { id, ...data } = updated;

    this.productionService.update(production.id, data).subscribe({
      next: () => this.loadProductions(),
      error: (err) => console.error('Erreur déplacement production:', err)
    });
  }

  isFirstStage(stage: ProductionStage): boolean {
    return this.stages.indexOf(stage) === 0;
  }

  isLastStage(stage: ProductionStage): boolean {
    return this.stages.indexOf(stage) === this.stages.length - 1;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.currentProduction = {
      commandeNumero: '', produit: '', quantite: 1, etapeActuelle: 'Nouvelle', dateDebut: '', datePrevueFin: ''
    };
    this.showModal = true;
  }

  openEditModal(production: Production): void {
    this.isEditMode = true;
    this.editingId = production.id;
    this.currentProduction = {
      commandeNumero: production.commandeNumero,
      produit: production.produit,
      quantite: production.quantite,
      etapeActuelle: production.etapeActuelle,
      dateDebut: production.dateDebut,
      datePrevueFin: production.datePrevueFin,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveProduction(): void {
    if (!this.currentProduction.commandeNumero || !this.currentProduction.produit) {
      return;
    }

    if (this.isEditMode && this.editingId !== null) {
      this.productionService.update(this.editingId, this.currentProduction).subscribe({
        next: () => {
          this.loadProductions();
          this.closeModal();
        },
        error: (err) => console.error('Erreur modification production:', err)
      });
    } else {
      this.productionService.add(this.currentProduction).subscribe({
        next: () => {
          this.loadProductions();
          this.closeModal();
        },
        error: (err) => console.error('Erreur ajout production:', err)
      });
    }
  }

  deleteProduction(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette production ?')) {
      this.productionService.delete(id).subscribe({
        next: () => this.loadProductions(),
        error: (err) => console.error('Erreur suppression production:', err)
      });
    }
  }
}