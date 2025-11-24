import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  logOutOutline, arrowBack, sunnyOutline, restaurantOutline,
  cafeOutline, moonOutline, checkmarkCircle, time, documentTextOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { VoucherService } from '../../services/voucher.service';

// Register all icons used in this component
addIcons({
  'log-out-outline': logOutOutline,
  'arrow-back': arrowBack,
  'sunny-outline': sunnyOutline,
  'restaurant-outline': restaurantOutline,
  'cafe-outline': cafeOutline,
  'moon-outline': moonOutline,
  'checkmark-circle': checkmarkCircle,
  'time': time,
  'document-text-outline': documentTextOutline
});

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPage implements OnInit {
  user: any;
  vouchers: any[] = [];
  loading: boolean = false;

  // All possible voucher types
  allVoucherTypes = [
    { value: 'Desayuno', label: 'Desayuno', icon: 'sunny-outline', color: 'warning' },
    { value: 'Almuerzo', label: 'Almuerzo', icon: 'restaurant-outline', color: 'primary' },
    { value: 'Merienda', label: 'Merienda', icon: 'cafe-outline', color: 'secondary' },
    { value: 'Cena 1', label: 'Cena 1', icon: 'moon-outline', color: 'tertiary' },
    { value: 'Cena 2', label: 'Cena 2', icon: 'moon-outline', color: 'dark' }
  ];

  // Shift rules matching backend
  shiftRules: any = {
    1: ['Desayuno', 'Almuerzo'],
    2: ['Merienda', 'Cena 1'],
    3: ['Cena 2', 'Desayuno']
  };

  voucherTypes: any[] = [];

  constructor(
    private authService: AuthService,
    private voucherService: VoucherService,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser();
    console.log('Current user:', this.user);

    // Filter voucher types based on user shift
    if (this.user && this.user.shift) {
      const allowedTypes = this.shiftRules[this.user.shift] || [];
      this.voucherTypes = this.allVoucherTypes.filter(vt => allowedTypes.includes(vt.value));
      console.log('Allowed voucher types for shift', this.user.shift, ':', this.voucherTypes);
    }
  }

  ngOnInit() {
    this.loadVouchers();
  }

  loadVouchers() {
    this.loading = true;
    this.voucherService.getVouchers().subscribe({
      next: (data) => {
        this.vouchers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vouchers:', err);
        this.loading = false;
      }
    });
  }

  generateVoucher(type: string) {
    this.loading = true;
    this.voucherService.generateVoucher(type).subscribe({
      next: (response) => {
        this.loadVouchers();
        this.presentAlert('Éxito', `Vale generado: ${response.voucher.code}`);
      },
      error: (err) => {
        this.loading = false;
        this.presentAlert('Error', err.error?.message || 'No se pudo generar el vale');
      }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
  }

  doRefresh(event: any) {
    this.voucherService.getVouchers().subscribe({
      next: (data) => {
        this.vouchers = data;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  goToHome() {
    this.router.navigate(['/pages/home']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/pages/login']);
  }
}
