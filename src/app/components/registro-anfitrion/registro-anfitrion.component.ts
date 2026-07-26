import { Component, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro-anfitrion',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './registro-anfitrion.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./registro-anfitrion.component.css'],
})
export class RegistroAnfitrionComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
  ) {}

  async registrar() {
    if (!this.email || !this.password) {
      this.error = 'Completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password,
      );
      const user = userCredential.user;

      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, {
        email: this.email,
        role: 'anfitrion',
        createdAt: new Date().toISOString(),
      });

      this.success = '✅ ¡Registro exitoso! Redirigiendo al dashboard...';

      setTimeout(() => {
        this.router.navigate(['/anfitrion/dashboard']);
      }, 2000);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        this.error = 'Este email ya está registrado';
      } else {
        this.error = 'Error al registrar: ' + err.message;
      }
    } finally {
      this.loading = false;
    }
  }
}
