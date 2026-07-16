import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AnfitrionDashboardComponent } from './components/anfitrion-dashboard/anfitrion-dashboard.component';
import { AnfitrionLoginComponent } from './components/anfitrion-login/anfitrion-login.component';
import { RegistroAnfitrionComponent } from './components/registro-anfitrion/registro-anfitrion.component';
import { InvitacionesComponent } from './components/invitaciones/invitaciones.component';
import { FormularioInvitacionComponent } from './components/invitaciones/formulario-invitacion/formulario-invitacion.component';
import { ValidacionComponent } from './components/validacion/validacion.component';
import { AnfitrionGuard } from './guards/anfitrion.guard';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';

export const routes: Routes = [
  // Página de inicio (landing page)
  { path: '', component: LandingComponent },

  // Rutas públicas
  { path: 'invitaciones/:slug', component: InvitacionesComponent },
  { path: 'validacion', component: ValidacionComponent },
  { path: 'anfitrion/registro', component: RegistroAnfitrionComponent },
  { path: 'anfitrion/login', component: AnfitrionLoginComponent },
  {
    path: 'anfitrion/recuperar-password',
    component: RecuperarPasswordComponent,
  },

  // Rutas de anfitrión (requieren autenticación)
  {
    path: 'anfitrion/dashboard',
    component: AnfitrionDashboardComponent,
    canActivate: [AnfitrionGuard],
  },
  {
    path: 'anfitrion/crear-invitacion',
    component: FormularioInvitacionComponent,
    canActivate: [AnfitrionGuard],
  },
  {
    path: 'anfitrion/editar-invitacion/:id',
    component: FormularioInvitacionComponent,
    canActivate: [AnfitrionGuard],
  },

  // Redirección por defecto
  { path: '**', redirectTo: '/' },
];
