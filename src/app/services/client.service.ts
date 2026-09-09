import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients: Client[] = [
    { id: 1, nom: 'Ben Salah', prenom: 'Amine', telephone: '21 345 678', email: 'amine.bs@email.com', adresse: 'Tunis, Tunisie' },
    { id: 2, nom: 'Trabelsi', prenom: 'Sarra', telephone: '22 456 789', email: 'sarra.t@email.com', adresse: 'Sousse, Tunisie' },
    { id: 3, nom: 'Jaziri', prenom: 'Karim', telephone: '23 567 890', email: 'karim.j@email.com', adresse: 'Sfax, Tunisie' },
    { id: 4, nom: 'Hammami', prenom: 'Nour', telephone: '24 678 901', email: 'nour.h@email.com', adresse: 'Nabeul, Tunisie' },
    { id: 5, nom: 'Ferjani', prenom: 'Yassine', telephone: '25 789 012', email: 'yassine.f@email.com', adresse: 'Bizerte, Tunisie' },
  ];

  private nextId = 6;

  getAll(): Client[] {
    return this.clients;
  }

  getById(id: number): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  add(client: Omit<Client, 'id'>): void {
    const newClient: Client = { id: this.nextId++, ...client };
    this.clients.push(newClient);
  }

  update(id: number, updatedClient: Omit<Client, 'id'>): void {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients[index] = { id, ...updatedClient };
    }
  }

  delete(id: number): void {
    this.clients = this.clients.filter(c => c.id !== id);
  }
}