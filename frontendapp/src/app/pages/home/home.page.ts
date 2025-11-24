import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  logOutOutline, restaurant, timeOutline, cardOutline, checkmarkCircleOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

// Register icons
addIcons({
  'log-out-outline': logOutOutline,
  'restaurant': restaurant,
  'time-outline': timeOutline,
  'card-outline': cardOutline,
  'checkmark-circle-outline': checkmarkCircleOutline
});

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  userName: string = '';

  meals = [
    {
      icon: '☀️',
      title: 'Desayuno',
      description: 'Comienza tu día con energía. Disponible de 10:00 AM a 11:00 AM.',
      features: ['🥐 Pan fresco', '☕ Café y té', '🍳 Huevos', '🥛 Lácteos'],
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80'
    },
    {
      icon: '🍽️',
      title: 'Almuerzo',
      description: 'El momento más importante del día. Disponible de 13:00 PM a 14:00 PM.',
      features: ['🥗 Ensaladas', '🍖 Plato principal', '🍚 Acompañamientos', '🍮 Postre'],
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'
    },
    {
      icon: '🧁',
      title: 'Merienda',
      description: 'Recarga energías por la tarde. Disponible de 18:00 PM a 19:00 PM.',
      features: ['🍪 Galletas', '☕ Bebidas calientes', '🥪 Sandwiches', '🍰 Pastelería'],
      image: 'https://hips.hearstapps.com/hmg-prod/images/sandwiches-elle-gourmet-6656c4ad89a6e.jpg?crop=1.00xw:0.734xh;0,0.128xh&resize=640:*'
    },
    {
      icon: '🌙',
      title: 'Cena',
      description: 'Finaliza tu turno con una buena comida. Disponible de 21:00 PM a 22:00 PM y 01:00 AM a 02:00 AM.',
      features: ['🍲 Sopas', '🍝 Pastas', '🍗 Proteínas', '🥗 Guarniciones'],
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.nombre || 'Usuario';
  }

  goToDashboard() {
    this.router.navigate(['/pages/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/pages/login']);
  }
}
