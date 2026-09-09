export type ProductCategory = 'Chemise' | 'Pantalon' | 'Veste' | 'T-shirt' | 'Accessoire' | 'Autre';

export interface Product {
  id: number;
  nom: string;
  reference: string;
  categorie: ProductCategory;
  taille: string;
  couleur: string;
  quantite: number;
  stockMinimum: number;
}