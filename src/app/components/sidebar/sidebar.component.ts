import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Commandes', icon: '📦', route: '/orders' },
    { label: 'Clients', icon: '👥', route: '/clients' },
    { label: 'Produits', icon: '👕', route: '/products' },
    { label: 'Production', icon: '🏭', route: '/production' },
    { label: 'Tâches', icon: '✅', route: '/tasks' },
    { label: 'Stock', icon: '📋', route: '/stock' },
  ];
}