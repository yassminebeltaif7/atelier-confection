import { Injectable } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, titre: 'Vérifier les mesures', description: 'Vérifier les mesures avant la coupe', productionAssociee: 'CMD-0125', responsable: 'Amel', priorite: 'Haute', statut: 'En cours', dateDebut: '08/09/2026', dateLimite: '10/09/2026' },
    { id: 2, titre: 'Couper le tissu', description: 'Découpe selon patron', productionAssociee: 'CMD-0126', responsable: 'Sami', priorite: 'Moyenne', statut: 'À faire', dateDebut: '09/09/2026', dateLimite: '11/09/2026' },
    { id: 3, titre: 'Contrôle qualité final', description: 'Vérifier la qualité de la couture', productionAssociee: 'CMD-0122', responsable: 'Amel', priorite: 'Haute', statut: 'À faire', dateDebut: '07/09/2026', dateLimite: '09/09/2026' },
    { id: 4, titre: 'Préparer les machines', description: 'Entretien avant démarrage', productionAssociee: 'CMD-0124', responsable: 'Karim', priorite: 'Basse', statut: 'Terminé', dateDebut: '05/09/2026', dateLimite: '06/09/2026' },
    { id: 5, titre: 'Emballage commande', description: 'Emballage final avant livraison', productionAssociee: 'CMD-0121', responsable: 'Sami', priorite: 'Moyenne', statut: 'Terminé', dateDebut: '30/08/2026', dateLimite: '31/08/2026' },
  ];

  private nextId = 6;

  getAll(): Task[] {
    return this.tasks;
  }

  add(task: Omit<Task, 'id'>): void {
    const newTask: Task = { id: this.nextId++, ...task };
    this.tasks.push(newTask);
  }

  update(id: number, updatedTask: Omit<Task, 'id'>): void {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { id, ...updatedTask };
    }
  }

  delete(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  isLate(task: Task): boolean {
    if (task.statut === 'Terminé' || task.statut === 'Annulé') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.parseDate(task.dateLimite) < today;
  }

  isDueSoon(task: Task): boolean {
    if (task.statut === 'Terminé' || task.statut === 'Annulé') return false;
    if (this.isLate(task)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = this.parseDate(task.dateLimite);
    const diffDays = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 1;
  }
}