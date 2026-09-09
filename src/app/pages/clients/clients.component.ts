import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  searchTerm = '';

  showModal = false;
  isEditMode = false;
  currentClient: Omit<Client, 'id'> = { nom: '', prenom: '', telephone: '', email: '', adresse: '' };
  editingId: number | null = null;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clients = this.clientService.getAll();
  }

  get filteredClients(): Client[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.clients;
    return this.clients.filter(c =>
      c.nom.toLowerCase().includes(term) ||
      c.prenom.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.telephone.includes(term)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.currentClient = { nom: '', prenom: '', telephone: '', email: '', adresse: '' };
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    this.isEditMode = true;
    this.editingId = client.id;
    this.currentClient = {
      nom: client.nom,
      prenom: client.prenom,
      telephone: client.telephone,
      email: client.email,
      adresse: client.adresse,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveClient(): void {
    if (!this.currentClient.nom || !this.currentClient.prenom) {
      return;
    }

    if (this.isEditMode && this.editingId !== null) {
      this.clientService.update(this.editingId, this.currentClient);
    } else {
      this.clientService.add(this.currentClient);
    }

    this.loadClients();
    this.closeModal();
  }

  deleteClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.delete(id);
      this.loadClients();
    }
  }
}