import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { InvitadosService } from '../../services/invitados.service';
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
import { OgImageService } from '../../services/og-image.service'; // 👈 Agregar al inicio
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anfitrion-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon],
  templateUrl: './anfitrion-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  // 🆕 Propiedades de paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  invitadosFiltrados: Invitado[] = [];
  totalPaginas: number = 0;
  invitadosCompletos: Invitado[] = [];
  Math = Math;

  private authSubscription!: Subscription;

  constructor(
    private invitadosService: InvitadosService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private ogImageService: OgImageService,
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
        // 👈 No llamar a cargarInvitados() aquí
      } else {
        // Usuario cerró sesión, limpiar datos
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
    this.paginaActual = 1; // Resetear a la pagina 1 al cambiar de tab
    this.cargarInvitados();
  }

  async cargarMisEventos() {
    const user = this.auth.currentUser;
    console.log('👤 Usuario en cargarMisEventos:', user?.email, user?.uid);

    if (user) {
      const q = query(
        collection(this.firestore, 'invitaciones'),
        where('anfitrionId', '==', user.uid),
      );
      const snapshot = await getDocs(q);

      // ✅ GUARDAR TODOS LOS DATOS DEL EVENTO
      this.misEventos = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          slug: doc.id,
          name: data['name'],
          heroImage: data['heroImage'] || '',
          heroImageMovil: data['heroImageMovil'] || '',
          heroImageEscritorio: data['heroImageEscritorio'] || '',
          tipo: data['tipo'] || '',
        };
      });

      console.log('📋 Eventos encontrados:', this.misEventos);
      console.log('📸 Imágenes del primer evento:', {
        heroImage: this.misEventos[0]?.heroImage,
        heroImageMovil: this.misEventos[0]?.heroImageMovil,
        heroImageEscritorio: this.misEventos[0]?.heroImageEscritorio,
      });

      if (this.misEventos.length > 0) {
        this.eventoSlug = this.misEventos[0].slug;
        this.cargarInvitados();
      } else {
        this.eventoSlug = '';
        this.invitados$ = undefined;
      }
    } else {
      console.log('⚠️ No hay usuario logueado');
    }
  }

  // Agrega este método después de cargarMisEventos()
  // ================================================================
  // 🗑️ ELIMINAR EVENTO CON SWEETALERT2
  // ================================================================
  async eliminarEvento(eventoSlug: string, eventoName: string) {
    // 1. Confirmación con SweetAlert2
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
      // Mostrar loading
      Swal.fire({
        title: 'Eliminando...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 1. Eliminar todos los invitados de este evento
      const invitadosQuery = query(
        collection(this.firestore, 'invitados'),
        where('eventoSlug', '==', eventoSlug),
      );
      const invitadosSnap = await getDocs(invitadosQuery);

      const deletePromises = invitadosSnap.docs.map((doc) =>
        deleteDoc(doc.ref),
      );
      await Promise.all(deletePromises);

      // 2. Eliminar el evento
      const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
      await deleteDoc(eventoRef);

      // 3. Recargar la lista de eventos
      await this.cargarMisEventos();

      // Éxito
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

    // 👇 SUSCRIBIRSE PARA APLICAR PAGINACIÓN
    this.invitados$.subscribe({
      next: (invitados) => {
        this.invitadosCompletos = invitados;
        this.totalPaginas = Math.ceil(
          this.invitadosCompletos.length / this.itemsPorPagina,
        );

        // Si la página actual es mayor que el total, resetear a 1
        if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
          this.paginaActual = 1;
        }

        this.aplicarPaginacion();
      },
      error: (error) => {
        console.error('Error al cargar invitados:', error);
      },
    });
  }

  cambiarEvento() {
    this.paginaActual = 1; // Resetear a pag 1 al cambiar de evento
    this.cargarInvitados();
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

  // ================================================================
  // 🗑️ ELIMINAR INVITADO
  // ================================================================
  async eliminarInvitado(inv: Invitado) {
    // ⚠️ Verificar ID ANTES de mostrar el diálogo
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
        // Mostrar loading
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Eliminar usando el servicio
        await this.invitadosService.eliminarInvitado(inv.id);

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: `${inv.nombre} fue eliminado correctamente`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Recargar la lista
        this.cargarInvitados();
      } catch (error) {
        console.error('Error al eliminar invitado:', error);
        Swal.fire('Error', 'No se pudo eliminar al invitado', 'error');
      }
    }
  }

  // ================================================================
  // MÉTODO PARA OBTENER LA IMAGEN OPTIMIZADA PARA WHATSAPP
  // ================================================================
  private getImagenWhatsApp(evento: any): string {
    if (!evento) return '';

    // 📱 Detectar si es móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 🖼️ Elegir la imagen según dispositivo
    let imagenUrl = '';
    if (isMobile && evento.heroImageMovil) {
      imagenUrl = evento.heroImageMovil;
    } else if (evento.heroImageEscritorio) {
      imagenUrl = evento.heroImageEscritorio;
    } else if (evento.heroImage) {
      imagenUrl = evento.heroImage;
    }

    if (!imagenUrl) return '';

    // ✅ Si es Cloudinary, aplicar transformación para WhatsApp
    if (imagenUrl.includes('cloudinary.com')) {
      const parts = imagenUrl.split('/upload/');
      if (parts.length === 2) {
        // Transformación: 1200x630, formato automático, calidad automática
        return `${parts[0]}/upload/f_auto,q_auto,w_1200,h_630,c_fill/${parts[1]}`;
      }
    }

    return imagenUrl;
  }

  // ================================================================
  // ENVIAR POR WHATSAPP CON CLOUDINARY
  // ================================================================
  enviarWhatsApp(inv: Invitado) {
    const urlInvitacion = `${window.location.origin}/invitaciones/${inv.slug}`;
    const urlConCache = `${urlInvitacion}?t=${Date.now()}`;

    const evento = this.misEventos.find((e) => e.slug === inv.eventoSlug);

    // 🖼️ Generar la imagen usando el servicio (opcional)
    let imagenGenerada = '';
    if (evento) {
      imagenGenerada = this.ogImageService.generateImage(evento, inv.nombre);
      console.log('🖼️ Imagen generada:', imagenGenerada);
    }

    // 🎯 Emoji según tipo de evento
    const emojiEvento =
      evento?.tipo === 'boda' ? '💍' : evento?.tipo === 'xv' ? '👗' : '🎉';

    // 📝 Mensaje
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

  // ================================================================
  // 📄 PAGINACIÓN
  // ================================================================
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

  // ================================================================
  // ✏️ EDITAR PASES DE UN INVITADO
  // ================================================================
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
        // Mostrar loading
        Swal.fire({
          title: 'Actualizando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        // Actualizar en Firebase
        await this.invitadosService.actualizarInvitado(inv.id, {
          pases: parseInt(nuevoPases),
        });

        // Mostrar éxito con los detalles del cambio
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
            <p style="color: #718096; font-size: 14px;">
              ✅ Cambio reflejado en la invitación
            </p>
          </div>
        `,
          timer: 3000,
          showConfirmButton: false,
        });

        // Recargar la lista
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
}
