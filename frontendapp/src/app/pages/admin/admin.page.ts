import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonSegment, IonSegmentButton, IonLabel, IonContent, IonRefresher,
  IonRefresherContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonInput, IonSelect, IonSelectOption, IonList, IonSpinner,
  IonBadge
} from '@ionic/angular/standalone';
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
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonSegment, IonSegmentButton, IonLabel, IonContent, IonRefresher,
    IonRefresherContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonInput, IonSelect, IonSelectOption, IonList, IonSpinner,
    IonBadge
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminPage implements OnInit {
  selectedSegment: string = 'users';
  users: any[] = [];
  auditLogs: any[] = [];
  userForm: FormGroup;
  loadingUsers: boolean = false;
  loadingAudit: boolean = false;
  loadingAction: boolean = false;

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
    const value = event.detail?.value || event.target?.value || this.selectedSegment;
    this.selectedSegment = value;
    
    // Recargar datos si es necesario
    if (value === 'users' && this.users.length === 0) {
      this.loadUsers();
    } else if (value === 'audit' && this.auditLogs.length === 0) {
      this.loadAudit();
    }
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loadingUsers = false;
        this.presentAlert('Error', 'No se pudieron cargar los usuarios');
      }
    });
  }

  loadAudit() {
    this.loadingAudit = true;
    this.voucherService.getAudit().subscribe({
      next: (data) => {
        this.auditLogs = data;
        this.loadingAudit = false;
      },
      error: (err) => {
        console.error('Error loading audit:', err);
        this.loadingAudit = false;
        this.presentAlert('Error', 'No se pudo cargar la auditoría');
      }
    });
  }

  addUser() {
    if (this.userForm.invalid) {
      this.presentAlert('Error', 'Por favor completa todos los campos correctamente');
      return;
    }

    this.loadingAction = true;
    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.loadingAction = false;
        this.userForm.reset({ rol: 'funcionario', turno: 1 });
        this.loadUsers();
        this.presentAlert('Éxito', 'Usuario creado correctamente');
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.loadingAction = false;
        this.presentAlert('Error', err.error?.message || 'No se pudo crear el usuario');
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
    this.loadingAction = true;
    this.voucherService.generateExtra(type).subscribe({
      next: (response) => {
        this.loadingAction = false;
        this.loadAudit();
        this.presentAlert('Éxito', `Vale extra generado: ${response.code}`);
      },
      error: (err) => {
        console.error('Error generating extra:', err);
        this.loadingAction = false;
        this.presentAlert('Error', err.error?.message || 'No se pudo generar el vale extra');
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
        error: (err) => {
          console.error('Error refreshing users:', err);
          event.target.complete();
        }
      });
    } else {
      this.voucherService.getAudit().subscribe({
        next: (data) => {
          this.auditLogs = data;
          event.target.complete();
        },
        error: (err) => {
          console.error('Error refreshing audit:', err);
          event.target.complete();
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/pages/login']);
  }
}
