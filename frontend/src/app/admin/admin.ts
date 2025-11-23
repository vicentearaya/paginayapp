import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { VoucherService } from '../services/voucher.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTabsModule, MatTableModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatCardModule,
    MatIconModule, MatToolbarModule, MatFormFieldModule
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  auditLogs: any[] = [];
  userForm: FormGroup;
  displayedColumnsUsers: string[] = ['id', 'nombre', 'email', 'rol', 'turno', 'actions'];
  displayedColumnsAudit: string[] = ['fecha', 'usuario', 'tipo', 'codigo', 'lugar', 'estado', 'actions'];

  constructor(
    private userService: UserService,
    private voucherService: VoucherService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['funcionario', Validators.required],
      turno: [1, Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadAudit();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }

  loadAudit() {
    this.voucherService.getAudit().subscribe(data => this.auditLogs = data);
  }

  addUser() {
    if (this.userForm.invalid) return;
    this.userService.createUser(this.userForm.value).subscribe(() => {
      this.loadUsers();
      this.userForm.reset({ rol: 'funcionario', turno: 1 });
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  generateExtra(type: string) {
    this.voucherService.generateExtra(type).subscribe({
      next: (res) => {
        alert(`Extra Generated: ${res.code}`);
        this.loadAudit();
      },
      error: (err) => alert('Error generating extra')
    });
  }

  redeem(code: string) {
    if (confirm('¿Marcar vale como canjeado?')) {
      this.voucherService.redeemVoucher(code).subscribe({
        next: () => {
          this.loadAudit();
        },
        error: (err) => alert('Error redeeming voucher')
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
