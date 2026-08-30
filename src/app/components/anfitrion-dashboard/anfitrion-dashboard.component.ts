import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { InvitadosService } from '../../services/invitados.service';
import { InvitacionesService } from '../../services/invitaciones.service';
import { Invitado } from '../../models/invitado.model';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { OgImageService } from '../../services/og-image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anfitrion-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon],
  templateUrl: './anfitrion-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Default, // 👈 CORREGIDO: Usar Default
  styleUrls: ['./anfitrion-dashboard.component.css'],
})
export class AnfitrionDashboardComponent implements OnInit, OnDestroy {
  tabActivo: 'pendiente' | 'confirmado' | 'rechazado' = 'pendiente';
  invitados$: Observable<Invitado[]> | undefined;
  nuevoInvitado: Partial<Invitado> = {
    nombre: '',
    pases: 1,
    mensajePersonalizado: '',
    estado: 'pendiente',
  };

  eventoSlug = '';
  misEventos: any[] = [];
  userName: string = '';
  userEmail: string = '';
  userPhotoURL: string = '';
  origin = window.location.origin;

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  invitadosFiltrados: Invitado[] = [];
  totalPaginas: number = 0;
  invitadosCompletos: Invitado[] = [];
  Math = Math;

  // Propiedades colaboradores
  colaboradores: any[] = [];
  emailColaborador: string = '';
  esAnfitrion: boolean = false;
  esColaborador: boolean = false;

  private authSubscription!: Subscription;

  constructor(
    private invitadosService: InvitadosService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private ogImageService: OgImageService,
    private invitacionesService: InvitacionesService,
    private cdr: ChangeDetectorRef,
  ) {}

  async cargarUsuario() {
    const user = this.auth.currentUser;
    if (user) {
      this.userEmail = user.email || '';
      this.userPhotoURL = user.photoURL || '';

      if (user.displayName) {
        this.userName = user.displayName;
      } else {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          this.userName =
            data['nombre'] || data['email']?.split('@')[0] || 'Anfitrión';
        } else {
          this.userName = this.userEmail.split('@')[0] || 'Anfitrión';
        }
      }
    }
  }

  ngOnInit() {
    this.cargarUsuario();

    this.authSubscription = authState(this.auth).subscribe((user) => {
      console.log('🔄 Auth state changed:', user?.email, user?.uid);
      if (user) {
        this.cargarUsuario();
        this.cargarMisEventos();
      } else {
        this.misEventos = [];
        this.eventoSlug = '';
        this.invitados$ = undefined;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  cambiarTab(tab: 'pendiente' | 'confirmado' | 'rechazado') {
    this.tabActivo = tab;
    this.paginaActual = 1;
    this.cargarInvitados();
  }

  async eliminarEvento(eventoSlug: string, eventoName: string) {
    const result = await Swal.fire({
      title: `¿Eliminar "${eventoName}"?`,
      text: `Esta acción eliminará TODOS los invitados asociados a este evento. No se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: 'Eliminando...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const invitadosQuery = query(
        collection(this.firestore, 'invitados'),
        where('eventoSlug', '==', eventoSlug),
      );
      const invitadosSnap = await getDocs(invitadosQuery);

      const deletePromises = invitadosSnap.docs.map((doc) =>
        deleteDoc(doc.ref),
      );
      await Promise.all(deletePromises);

      const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
      await deleteDoc(eventoRef);

      await this.cargarMisEventos();

      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: `Invitación "${eventoName}" eliminada correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la invitación',
        confirmButtonColor: '#e53e3e',
        confirmButtonText: 'Entendido',
      });
    }
  }

  obtenerNombreEvento(): string {
    const evento = this.misEventos.find((e) => e.slug === this.eventoSlug);
    return evento ? evento.name : 'este evento';
  }

  cargarInvitados() {
    if (!this.eventoSlug) return;

    this.invitados$ = this.invitadosService.getInvitadosPorEvento(
      this.eventoSlug,
      this.tabActivo,
    );

    this.invitados$.subscribe({
      next: (invitados) => {
        this.invitadosCompletos = invitados;
        this.totalPaginas = Math.ceil(
          this.invitadosCompletos.length / this.itemsPorPagina,
        );

        if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
          this.paginaActual = 1;
        }

        this.aplicarPaginacion();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar invitados:', error);
      },
    });
  }

  // 👈 CORREGIDO: Ahora es async para esperar la verificación de roles
  async cambiarEvento() {
    this.paginaActual = 1;
    this.cargarInvitados();
    await this.verificarRoles();
  }

  generarSlug(nombre: string): string {
    return (
      nombre.toLowerCase().replace(/\s+/g, '-') +
      '-' +
      Math.floor(Math.random() * 10000)
    );
  }

  copiarLink(slug: string) {
    const link = `${window.location.origin}/invitaciones/${slug}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Copiado!',
          text: 'Link de invitación copiado al portapapeles',
          timer: 1800,
          showConfirmButton: false,
          position: 'top-end',
          toast: true,
          background: '#1a202c',
          color: '#ffffff',
          iconColor: '#48bb78',
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error al copiar',
          text: 'Intenta copiar el link manualmente',
          confirmButtonColor: '#e53e3e',
          confirmButtonText: 'Entendido',
        });
      });
  }

  async agregarInvitado() {
    if (!this.nuevoInvitado.nombre) return;

    const user = this.auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para agregar invitados');
      return;
    }

    if (!this.eventoSlug) {
      alert('Primero crea un evento (invitación)');
      return;
    }

    const invitado: Invitado = {
      id: '',
      nombre: this.nuevoInvitado.nombre!,
      pases: this.nuevoInvitado.pases!,
      mensajePersonalizado: this.nuevoInvitado.mensajePersonalizado || '',
      slug: this.generarSlug(this.nuevoInvitado.nombre!),
      estado: 'pendiente',
      anfitrionId: user.uid,
      eventoSlug: this.eventoSlug,
    };

    await this.invitadosService.agregarInvitado(invitado);

    this.nuevoInvitado = {
      nombre: '',
      pases: 1,
      mensajePersonalizado: '',
      estado: 'pendiente',
    };

    this.cargarInvitados();
  }

  async cambiarEstado(
    inv: Invitado,
    estado: 'pendiente' | 'confirmado' | 'rechazado',
  ) {
    await this.invitadosService.actualizarInvitado(inv.id!, { estado });
    this.cargarInvitados();
  }

  async eliminarInvitado(inv: Invitado) {
    if (!inv.id) {
      Swal.fire('Error', 'El invitado no tiene un ID válido', 'error');
      return;
    }

    const result = await Swal.fire({
      title: `¿Eliminar a ${inv.nombre}?`,
      text: 'Esta acción eliminará al invitado y su invitación. No se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await this.invitadosService.eliminarInvitado(inv.id);

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: `${inv.nombre} fue eliminado correctamente`,
          timer: 2000,
          showConfirmButton: false,
        });

        this.cargarInvitados();
      } catch (error) {
        console.error('Error al eliminar invitado:', error);
        Swal.fire('Error', 'No se pudo eliminar al invitado', 'error');
      }
    }
  }

  enviarWhatsApp(inv: Invitado) {
    const urlInvitacion = `${window.location.origin}/invitaciones/${inv.slug}`;
    const urlConCache = `${urlInvitacion}?t=${Date.now()}`;

    const evento = this.misEventos.find((e) => e.slug === inv.eventoSlug);

    const emojiEvento =
      evento?.tipo === 'boda' ? '💍' : evento?.tipo === 'xv' ? '👗' : '🎉';

    const mensaje = [
      `*INVITACIÓN ESPECIAL*`,
      ``,
      `Hola *${inv.nombre}*,`,
      `Te esperamos con *${inv.pases} pase${inv.pases > 1 ? 's' : ''}*${evento ? ` ${emojiEvento} *${evento.name}*` : ''}.`,
      ``,
      `📲 ${urlConCache}`,
      ``,
      `✅ Confirma tu asistencia`,
    ].join('\n');

    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
  }

  descargarPDF(inv: Invitado) {
    alert(`Descargando PDF para ${inv.nombre} (simulado)`);
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  aplicarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.invitadosFiltrados = this.invitadosCompletos.slice(inicio, fin);
  }

  irPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.aplicarPaginacion();
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.aplicarPaginacion();
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.aplicarPaginacion();
    }
  }

  async editarPases(inv: Invitado) {
    if (!inv.id) {
      Swal.fire('Error', 'El invitado no tiene un ID válido', 'error');
      return;
    }

    const { value: nuevoPases } = await Swal.fire({
      title: `Editar pases para ${inv.nombre}`,
      text: '¿Cuántas personas asistirán?',
      icon: 'question',
      input: 'number',
      inputLabel: 'Número de pases',
      inputValue: inv.pases,
      inputAttributes: {
        min: '1',
        max: '20',
        step: '1',
      },
      showCancelButton: true,
      confirmButtonColor: '#4299e1',
      cancelButtonColor: '#e53e3e',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || parseInt(value) < 1) {
          return 'Debes ingresar al menos 1 pase';
        }
        if (parseInt(value) > 20) {
          return 'Máximo 20 pases permitidos';
        }
        return null;
      },
    });

    if (nuevoPases) {
      try {
        Swal.fire({
          title: 'Actualizando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await this.invitadosService.actualizarInvitado(inv.id, {
          pases: parseInt(nuevoPases),
        });

        Swal.fire({
          icon: 'success',
          title: '¡Pases actualizados!',
          html: `
          <div style="text-align: center;">
            <p style="font-size: 16px; margin-bottom: 8px;">
              <strong>${inv.nombre}</strong> ahora tiene 
              <strong style="color: #4299e1; font-size: 24px;">${nuevoPases}</strong> 
              pase${parseInt(nuevoPases) > 1 ? 's' : ''}
            </p>
          </div>
        `,
          timer: 3000,
          showConfirmButton: false,
        });

        this.cargarInvitados();
      } catch (error: any) {
        console.error('Error al actualizar pases:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo actualizar los pases',
          confirmButtonColor: '#e53e3e',
          confirmButtonText: 'Entendido',
        });
      }
    }
  }

  // Verificar roles al cargar el evento
  async verificarRoles() {
    if (!this.eventoSlug) {
      console.warn('⚠️ verificarRoles: eventoSlug vacío');
      this.esAnfitrion = false;
      this.esColaborador = false;
      this.cdr.detectChanges();
      return;
    }

    console.log('🔍 Verificando roles para evento:', this.eventoSlug);

    try {
      const eventoRef = doc(this.firestore, `invitaciones/${this.eventoSlug}`);
      const eventoSnap = await getDoc(eventoRef);

      if (!eventoSnap.exists()) {
        console.error('❌ El evento no existe en Firestore:', this.eventoSlug);
        this.esAnfitrion = false;
        this.esColaborador = false;
        this.cdr.detectChanges();
        return;
      }

      const data = eventoSnap.data();
      const user = this.auth.currentUser;

      // 👈 EVALUACIÓN DIRECTA DE ROLES
      this.esAnfitrion = data['anfitrionId'] === user?.uid;
      this.esColaborador = (data['colaboradores'] || []).includes(user?.uid);

      console.log('👑 esAnfitrion:', this.esAnfitrion);
      console.log('🤝 esColaborador:', this.esColaborador);

      if (this.esAnfitrion) {
        await this.cargarColaboradores();
      } else {
        this.colaboradores = [];
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al verificar roles:', error);
      this.esAnfitrion = false;
      this.esColaborador = false;
      this.cdr.detectChanges();
    }
  }

  async cargarColaboradores() {
    try {
      this.colaboradores = await this.invitacionesService.obtenerColaboradores(
        this.eventoSlug,
      );
    } catch (error) {
      console.error('Error al cargar colaboradores:', error);
    }
  }

  async invitarColaborador() {
    if (!this.emailColaborador) {
      Swal.fire({
        icon: 'warning',
        title: 'Email requerido',
        text: 'Ingresa el email del colaborador',
        confirmButtonColor: '#ed8936',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Invitar colaborador',
        html: `
        <p>¿Invitar a <strong>${this.emailColaborador}</strong> como colaborador?</p>
        <p style="color: #718096; font-size: 14px;">
          Podrá ver y editar invitados, enviar WhatsApp y más
        </p>
      `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4299e1',
        cancelButtonColor: '#718096',
        confirmButtonText: '✅ Invitar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        const response = await this.invitacionesService.invitarColaborador(
          this.eventoSlug,
          this.emailColaborador,
        );

        await Swal.fire({
          icon: 'success',
          title: '¡Colaborador invitado!',
          text: response.message,
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });

        this.emailColaborador = '';
        await this.cargarColaboradores();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo invitar al colaborador',
        confirmButtonColor: '#e53e3e',
        confirmButtonText: 'Entendido',
      });
    }
  }

  async quitarColaborador(colaborador: any) {
    const result = await Swal.fire({
      title: `¿Quitar a ${colaborador.nombre || colaborador.email}?`,
      text: 'Dejará de tener acceso a este evento',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await this.invitacionesService.quitarColaborador(
          this.eventoSlug,
          colaborador.uid,
        );

        await Swal.fire({
          icon: 'success',
          title: 'Colaborador removido',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });

        await this.cargarColaboradores();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo quitar al colaborador',
          confirmButtonColor: '#e53e3e',
          confirmButtonText: 'Entendido',
        });
      }
    }
  }

  async cargarMisEventos() {
    const user = this.auth.currentUser;
    if (user) {
      // 1. Eventos donde es Anfitrión
      const q1 = query(
        collection(this.firestore, 'invitaciones'),
        where('anfitrionId', '==', user.uid),
      );
      const snapshot1 = await getDocs(q1);
      const eventosAnfitrion = snapshot1.docs.map((doc) => ({
        slug: doc.id,
        ...doc.data(),
        rol: 'anfitrion',
      }));

      // 2. Eventos donde es Colaborador
      const q2 = query(
        collection(this.firestore, 'invitaciones'),
        where('colaboradores', 'array-contains', user.uid),
      );
      const snapshot2 = await getDocs(q2);
      const eventosColaborador = snapshot2.docs.map((doc) => ({
        slug: doc.id,
        ...doc.data(),
        rol: 'colaborador',
      }));

      // Evitar duplicados si por algún motivo está en ambos
      const mapaEventos = new Map();
      [...eventosAnfitrion, ...eventosColaborador].forEach((evt) => {
        mapaEventos.set(evt.slug, evt);
      });

      this.misEventos = Array.from(mapaEventos.values());

      if (this.misEventos.length > 0) {
        this.eventoSlug = this.misEventos[0].slug;
        this.cargarInvitados();
        await this.verificarRoles();
      }
    }
  }
}
