import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async registrarConGoogle() {
    this.loading = true;
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/anfitrion/dashboard']);
    } catch (error) {
      console.error('Error al registrar con Google:', error);
    } finally {
      this.loading = false;
    }
  }
}
