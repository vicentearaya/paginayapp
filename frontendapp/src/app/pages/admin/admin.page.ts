import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  logOutOutline, trashOutline, nutritionOutline, cafeOutline,
  checkmarkCircle, time, checkmarkOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { VoucherService } from '../../services/voucher.service';

// Register icons
addIcons({
  'log-out-outline': logOutOutline,
  'trash-outline': trashOutline,
  'nutrition-outline': nutritionOutline,
  'cafe-outline': cafeOutline,
  'checkmark-circle': checkmarkCircle,
  'time': time,
  'checkmark-outline': checkmarkOutline
});

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminPage implements OnInit {
  selectedSegment: string = 'users';
  users: any[] = [];
  auditLogs: any[] = [];
  userForm: FormGroup;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private voucherService: VoucherService,
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

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadAudit() {
    this.loading = true;
    this.voucherService.getAudit().subscribe({
      next: (data) => {
        this.auditLogs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addUser() {
    if (this.userForm.invalid) return;

    this.loading = true;
    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.loadUsers();
        this.userForm.reset({ rol: 'funcionario', turno: 1 });
        this.presentAlert('Éxito', 'Usuario creado correctamente');
      },
      error: (err) => {
        this.loading = false;
        this.presentAlert('Error', 'No se pudo crear el usuario');
      }
    });
  }

  async deleteUser(id: number) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar';
    alert.message = '¿Estás seguro de eliminar este usuario?';
    alert.buttons = [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: () => {
          this.userService.deleteUser(id).subscribe({
            next: () => {
              this.loadUsers();
              this.presentAlert('Éxito', 'Usuario eliminado');
            },
            error: () => {
              this.presentAlert('Error', 'No se pudo eliminar el usuario');
            }
          });
        }
      }
    ];
    document.body.appendChild(alert);
    await alert.present();
  }

  generateExtra(type: string) {
    this.loading = true;
    this.voucherService.generateExtra(type).subscribe({
      next: (response) => {
        this.loadAudit();
        this.presentAlert('Éxito', `Vale extra generado: ${response.code}`);
      },
      error: () => {
        this.loading = false;
        this.presentAlert('Error', 'No se pudo generar el vale extra');
      }
    });
  }

  async redeemVoucher(code: string) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar';
    alert.message = '¿Marcar vale como canjeado?';
    alert.buttons = [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Canjear',
        handler: () => {
          this.voucherService.redeemVoucher(code).subscribe({
            next: () => {
              this.loadAudit();
            },
            error: () => {
              this.presentAlert('Error', 'No se pudo canjear el vale');
            }
          });
        }
      }
    ];
    document.body.appendChild(alert);
    await alert.present();
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
    if (this.selectedSegment === 'users') {
      this.userService.getUsers().subscribe({
        next: (data) => {
          this.users = data;
          event.target.complete();
        },
        error: () => event.target.complete()
      });
    } else {
      this.voucherService.getAudit().subscribe({
        next: (data) => {
          this.auditLogs = data;
          event.target.complete();
        },
        error: () => event.target.complete()
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/pages/login']);
  }
}
