export type TaskPriority = 'Haute' | 'Moyenne' | 'Basse';
export type TaskStatus = 'À faire' | 'En cours' | 'Terminé' | 'Annulé';

export interface Task {
  id: number;
  titre: string;
  description: string;
  productionAssociee: string;
  responsable: string;
  priorite: TaskPriority;
  statut: TaskStatus;
  dateDebut: string;
  dateLimite: string;
}