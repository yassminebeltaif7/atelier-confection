import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Production, ProductionStage } from '../models/production';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  private apiUrl = 'http://localhost:3000/api/productions';

  stages: ProductionStage[] = [
    'Nouvelle', 'Préparation', 'Coupe', 'Couture', 'Contrôle qualité', 'Emballage', 'Terminée'
  ];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Production[]> {
    return this.http.get<Production[]>(this.apiUrl);
  }

  add(production: Omit<Production, 'id'>): Observable<Production> {
    return this.http.post<Production>(this.apiUrl, production);
  }

  update(id: number, production: Omit<Production, 'id'>): Observable<Production> {
    return this.http.put<Production>(`${this.apiUrl}/${id}`, production);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getNextStage(current: ProductionStage): ProductionStage | null {
    const index = this.stages.indexOf(current);
    return index < this.stages.length - 1 ? this.stages[index + 1] : null;
  }

  getPreviousStage(current: ProductionStage): ProductionStage | null {
    const index = this.stages.indexOf(current);
    return index > 0 ? this.stages[index - 1] : null;
  }
}