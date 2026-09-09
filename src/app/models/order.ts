export type OrderStatus = 'Nouvelle' | 'En préparation' | 'En production' | 'Terminée' | 'Livrée' | 'Annulée';

export interface Order {
  id: number;
  numero: string;
  client: string;
  produit: string;
  quantite: number;
  taille: string;
  couleur: string;
  dateCommande: string;
  dateLivraison: string;
  statut: OrderStatus;
}