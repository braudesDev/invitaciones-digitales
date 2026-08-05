// ================================================================
// INVITACIÓN VÁLIDA - COMPONENTE
// ================================================================
// Archivo: invitacion-valida-section.component.ts
//
// Este componente muestra el pase de ingreso al evento con:
// - Nombre del invitado
// - Número de pases
// - Código QR personalizado
// - Estado de confirmación
// ================================================================

import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { InvitadosService } from '../../../../../services/invitados.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

// ================================================================
// DECORADOR DEL COMPONENTE
// ================================================================
@Component({
  selector: 'app-invitacion-valida-section', // Selector HTML
  standalone: true, // Componente standalone
  imports: [], // Sin imports adicionales
  templateUrl: './invitacion-valida-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager, // Estrategia de detección de cambios
  styleUrls: ['./invitacion-valida-section.component.css'],
})

// ================================================================
// CLASE PRINCIPAL DEL COMPONENTE
// ================================================================
export class InvitacionValidaSectionComponent implements OnInit {
  // ==============================================================
  // INPUTS - Datos recibidos desde el componente padre
  // ==============================================================

  /** Nombre del invitado que visualiza el pase */
  @Input() invitado: string = '';

  /** Número de pases disponibles para el invitado */
  @Input() pases: number = 1;

  /** Mensaje personalizado opcional para el invitado */
  @Input() mensajePersonalizado?: string;

  /** Datos del evento (nombre, fecha, lugar, slug, etc.) */
  @Input() eventoData: any = {};

  // ==============================================================
  // PROPIEDADES DEL COMPONENTE
  // ==============================================================

  /** URL del código QR generado */
  qrCodeUrl: string = '';

  /** ID del invitado (obtenido del servicio) */
  invitadoId: string = '';

  /** Estado actual del invitado: 'confirmado' | 'pendiente' | 'rechazado' */
  estadoActual: string = 'pendiente';

  // ==============================================================
  // CONSTRUCTOR - Inyección de dependencias
  // ==============================================================
  constructor(
    private invitadosService: InvitadosService, // Servicio para gestionar invitados
    private route: ActivatedRoute, // Para obtener parámetros de la URL
  ) {}

  // ==============================================================
  // CICLO DE VIDA - ngOnInit
  // ==============================================================
  // Se ejecuta al inicializar el componente
  // ==============================================================
  ngOnInit() {
    this.obtenerInvitadoId(); // Obtener el ID del invitado desde la URL
    this.generarQR(); // Generar el código QR
  }

  // ==============================================================
  // MÉTODO: obtenerInvitadoId()
  // ==============================================================
  // Obtiene el ID del invitado desde el servicio usando el slug de la URL
  // También actualiza el estado del invitado
  // ==============================================================
  async obtenerInvitadoId() {
    const slug = this.route.snapshot.paramMap.get('slug'); // Obtener slug de la URL

    if (slug) {
      // Buscar el invitado por slug en el servicio
      this.invitadosService.getInvitadoPorSlug(slug).subscribe((inv) => {
        if (inv && inv.id) {
          this.invitadoId = inv.id; // Guardar el ID del invitado
          this.estadoActual = inv.estado; // Actualizar el estado
          this.generarQR(); // Regenerar QR con estado actualizado
        }
      });
    }
  }

  // ==============================================================
  // MÉTODO: generarQR()
  // ==============================================================
  // Genera un código QR con la información del invitado y el evento
  // Utiliza la API de QR Server (https://api.qrserver.com)
  // ==============================================================
  generarQR() {
    // --- 1. Preparar los datos para el QR ---
    const qrData = {
      tipo: 'validacion-invitacion', // Tipo de QR
      invitadoId: this.invitadoId, // ID único del invitado
      invitado: this.invitado, // Nombre del invitado
      pases: this.pases, // Número de pases
      evento: this.eventoData.name || 'Evento', // Nombre del evento
      eventoSlug: this.eventoData.slug || '', // Slug del evento
      fecha: this.eventoData.fecha || new Date().toISOString(), // Fecha del evento
      lugar: this.eventoData.lugar || '', // Lugar del evento
      confirmado: this.estadoActual === 'confirmado', // Estado de confirmación
      mensaje: this.mensajePersonalizado || '', // Mensaje personalizado
    };

    // --- 2. Convertir los datos a string JSON ---
    const qrText = JSON.stringify(qrData);

    // --- 3. Generar URL del QR usando la API ---
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrText)}`;

    // --- 4. Logs para depuración ---
  }

  // ==============================================================
  // MÉTODO: descargarQR() - VERSIÓN CORREGIDA
  // ==============================================================
  // Descarga el código QR como imagen PNG usando fetch
  // ==============================================================
  descargarQR() {
    // Mostrar mensaje de carga
    Swal.fire({
      title: 'Descargando QR...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Usar fetch para obtener la imagen desde la URL
    fetch(this.qrCodeUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al descargar el QR');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-${this.invitado.replace(/\s/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // ✅ Cerrar el Swal de carga sin mostrar mensaje de éxito
        // El navegador ya muestra su propio diálogo de descarga
        Swal.close();
      })
      .catch((error) => {
        // ❌ Solo mostrar error si algo falla
        Swal.fire({
          icon: 'error',
          title: '❌ Error',
          text: 'No se pudo descargar el QR. Intenta de nuevo.',
          confirmButtonColor: '#c9a87c',
        });
      });
  }
}
