import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonInput, IonButton, IonText, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { restaurant } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

addIcons({ restaurant });

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonInput, IonButton, IonText, IonIcon
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Login form submitted');
    console.log('Form valid:', !this.loginForm.invalid);
    console.log('Form values:', this.loginForm.value);

    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log('Attempting login with:', email);

    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        if (user.role === 'admin') {
          this.router.navigate(['/pages/admin']);
        } else {
          this.router.navigate(['/pages/home']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = 'Credenciales inválidas';
      }
    });
  }
}
