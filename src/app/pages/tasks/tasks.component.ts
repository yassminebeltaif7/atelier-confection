import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  searchTerm = '';
  selectedStatus = 'Tous';
  selectedPriority = 'Toutes';

  statuses: TaskStatus[] = ['À faire', 'En cours', 'Terminé', 'Annulé'];
  priorities: TaskPriority[] = ['Haute', 'Moyenne', 'Basse'];

  showModal = false;
  isEditMode = false;
  currentTask: Omit<Task, 'id'> = {
    titre: '', description: '', productionAssociee: '', responsable: '',
    priorite: 'Moyenne', statut: 'À faire', dateDebut: '', dateLimite: ''
  };
  editingId: number | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.getAll();
  }

  get filteredTasks(): Task[] {
    let result = this.tasks;

    if (this.selectedStatus !== 'Tous') {
      result = result.filter(t => t.statut === this.selectedStatus);
    }

    if (this.selectedPriority !== 'Toutes') {
      result = result.filter(t => t.priorite === this.selectedPriority);
    }

    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(t => t.titre.toLowerCase().includes(term));
    }

    return result;
  }

  isLate(task: Task): boolean {
    return this.taskService.isLate(task);
  }

  isDueSoon(task: Task): boolean {
    return this.taskService.isDueSoon(task);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Haute': return 'priority-high';
      case 'Moyenne': return 'priority-medium';
      default: return 'priority-low';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'À faire': return 'status-todo';
      case 'En cours': return 'status-progress';
      case 'Terminé': return 'status-done';
      case 'Annulé': return 'status-cancelled';
      default: return '';
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.currentTask = {
      titre: '', description: '', productionAssociee: '', responsable: '',
      priorite: 'Moyenne', statut: 'À faire', dateDebut: '', dateLimite: ''
    };
    this.showModal = true;
  }

  openEditModal(task: Task): void {
    this.isEditMode = true;
    this.editingId = task.id;
    this.currentTask = {
      titre: task.titre,
      description: task.description,
      productionAssociee: task.productionAssociee,
      responsable: task.responsable,
      priorite: task.priorite,
      statut: task.statut,
      dateDebut: task.dateDebut,
      dateLimite: task.dateLimite,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveTask(): void {
    if (!this.currentTask.titre) {
      return;
    }

    if (this.isEditMode && this.editingId !== null) {
      this.taskService.update(this.editingId, this.currentTask);
    } else {
      this.taskService.add(this.currentTask);
    }

    this.loadTasks();
    this.closeModal();
  }

  deleteTask(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      this.taskService.delete(id);
      this.loadTasks();
    }
  }
}