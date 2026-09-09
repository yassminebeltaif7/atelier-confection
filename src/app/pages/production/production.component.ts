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
    this.productions = this.productionService.getAll();
  }

  getByStage(stage: ProductionStage): Production[] {
    return this.productions.filter(p => p.etapeActuelle === stage);
  }

  moveNext(id: number): void {
    this.productionService.moveToNextStage(id);
    this.loadProductions();
  }

  movePrevious(id: number): void {
    this.productionService.moveToPreviousStage(id);
    this.loadProductions();
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
      this.productionService.update(this.editingId, this.currentProduction);
    } else {
      this.productionService.add(this.currentProduction);
    }

    this.loadProductions();
    this.closeModal();
  }

  deleteProduction(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette production ?')) {
      this.productionService.delete(id);
      this.loadProductions();
    }
  }
}