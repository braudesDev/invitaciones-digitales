import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { authState } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AnfitrionGuard {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    // Esperar a que Firebase recupere el usuario
    const user = await firstValueFrom(authState(this.auth));

    if (!user) {
      this.router.navigate(['/anfitrion/login']);
      return false;
    }

    // Verificar si el usuario es anfitrión
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);
    const role = userSnap.data()?.['role'] || 'invitado';

    if (role === 'anfitrion') {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
