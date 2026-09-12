import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  add(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  update(id: number, task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
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