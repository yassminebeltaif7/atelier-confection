import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  add(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  update(id: number, order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  isLate(order: Order): boolean {
    if (order.statut === 'Livrée' || order.statut === 'Annulée') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.parseDate(order.dateLivraison) < today;
  }

  isNearDeadline(order: Order): boolean {
    if (order.statut === 'Livrée' || order.statut === 'Annulée') return false;
    if (this.isLate(order)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveryDate = this.parseDate(order.dateLivraison);
    const diffDays = (deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  }
}