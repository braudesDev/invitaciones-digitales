import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private auth = inject(Auth);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const user = await firstValueFrom(authState(this.auth));

    if (user) {
      return true;
    }

    this.router.navigate(['/anfitrion/login']);
    return false;
  }
}
