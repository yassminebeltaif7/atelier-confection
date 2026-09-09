export type StockCategory = 'Tissus' | 'Fils' | 'Boutons' | 'Fermetures' | 'Accessoires' | 'Produits finis';
export type MovementType = 'Entrée' | 'Sortie';

export interface StockItem {
  id: number;
  nom: string;
  categorie: StockCategory;
  quantite: number;
  unite: string;
}

export interface StockMovement {
  id: number;
  itemId: number;
  itemNom: string;
  type: MovementType;
  quantite: number;
  date: string;
}