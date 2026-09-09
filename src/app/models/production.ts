export type ProductionStage =
  | 'Nouvelle'
  | 'Préparation'
  | 'Coupe'
  | 'Couture'
  | 'Contrôle qualité'
  | 'Emballage'
  | 'Terminée';

export interface Production {
  id: number;
  commandeNumero: string;
  produit: string;
  quantite: number;
  etapeActuelle: ProductionStage;
  dateDebut: string;
  datePrevueFin: string;
}