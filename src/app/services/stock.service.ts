import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockItem, StockMovement, MovementType } from '../models/stock-item';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:3000/api/stock';

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`${this.apiUrl}/items`);
  }

  getAllMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/movements`);
  }

  addItem(item: Omit<StockItem, 'id'>): Observable<StockItem> {
    return this.http.post<StockItem>(`${this.apiUrl}/items`, item);
  }

  updateItem(id: number, item: Omit<StockItem, 'id'>): Observable<StockItem> {
    return this.http.put<StockItem>(`${this.apiUrl}/items/${id}`, item);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${id}`);
  }

  addMovement(itemId: number, type: MovementType, quantite: number, date: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/movements`, { itemId, type, quantite, date });
  }
}