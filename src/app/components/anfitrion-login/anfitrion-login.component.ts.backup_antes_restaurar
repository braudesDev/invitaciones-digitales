import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-anfitrion-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './anfitrion-login.component.html',
  styleUrls: ['./anfitrion-login.component.css'],
})
export class AnfitrionLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  loadingGoogle = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.error = 'Ingresa email y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/anfitrion/dashboard']);
    } catch (err: any) {
      console.error('Error de login:', err);
      if (err.code === 'auth/invalid-credential') {
        this.error = 'Email o contraseña incorrectos';
      } else {
        this.error = 'Error al iniciar sesión';
      }
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    this.loadingGoogle = true;
    this.error = '';

    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/anfitrion/dashboard']);
    } catch (err: any) {
      console.error('Error en Google login:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        this.error = 'Cerraste la ventana de Google';
      } else {
        this.error = 'Error al iniciar sesión con Google';
      }
    } finally {
      this.loadingGoogle = false;
    }
  }
}
