import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { VoucherService } from '../services/voucher.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  vouchers: any[] = [];
  allowedTypes: string[] = [];

  constructor(
    private authService: AuthService,
    private voucherService: VoucherService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadVouchers();
    this.setAllowedTypes();
  }

  setAllowedTypes() {
    // Hardcoded logic for UI feedback, backend validates anyway
    const shift = this.user.shift;
    if (shift === 1) this.allowedTypes = ['Desayuno', 'Almuerzo'];
    else if (shift === 2) this.allowedTypes = ['Merienda', 'Cena 1'];
    else if (shift === 3) this.allowedTypes = ['Cena 2', 'Desayuno'];
  }

  loadVouchers() {
    this.voucherService.getVouchers().subscribe(data => {
      this.vouchers = data;
    });
  }

  generateVoucher(type: string) {
    this.voucherService.generateVoucher(type).subscribe({
      next: (res) => {
        alert(`Voucher Generated: ${res.voucher.code}`);
        this.loadVouchers();
      },
      error: (err) => {
        alert(err.error.message || 'Error generating voucher');
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
