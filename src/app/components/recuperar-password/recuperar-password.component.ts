import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent {
  email = '';
  loading = false;
  success = '';
  error = '';

  constructor(private authService: AuthService) {}

  async recuperar() {
    if (!this.email) {
      this.error = 'Ingresa tu email';
      return;
    }

    this.loading = true;
    this.success = '';
    this.error = '';

    try {
      await this.authService.sendPasswordReset(this.email);
      this.success =
        '✅ Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.';
      this.email = '';
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        this.error = 'No existe una cuenta con este email';
      } else {
        this.error = 'Error al enviar el enlace. Intenta de nuevo.';
      }
    } finally {
      this.loading = false;
    }
  }
}
