// src/app/components/invitaciones/invitacion-generica/sections/confirmacion-section/confirmacion-section.component.ts

import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitadosService } from '../../../../../services/invitados.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Confirmacion } from '../../../../../models/confirmacion.model';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-confirmacion-section',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './confirmacion-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./confirmacion-section.component.css'],
})
export class ConfirmacionSectionComponent implements OnInit {
  @Input() eventoData: any = {};
  @Input() data!: Confirmacion; // 👈 Datos de personalización
  @Input() modo: 'edicion' | 'vista' = 'vista';
  @Input() fontFamily: string = 'Playfair Display, Georgia, serif';

  invitadoId: string = '';
  estadoActual: 'pendiente' | 'confirmado' | 'rechazado' = 'pendiente';
  confirmando = false;
  cargando = true;

  constructor(
    private invitadosService: InvitadosService,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    await this.obtenerInvitadoId();
    this.cargando = false;
  }

  async obtenerInvitadoId() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      console.error('❌ No hay slug en la URL');
      return;
    }

    try {
      const inv = await firstValueFrom(
        this.invitadosService.getInvitadoPorSlug(slug),
      );
      if (inv && inv.id) {
        this.invitadoId = inv.id;
        this.estadoActual = inv.estado;
        console.log('✅ Invitado encontrado:', inv);
        console.log('📌 Estado actual:', this.estadoActual);
      }
    } catch (error) {
      console.error('❌ Error al buscar invitado:', error);
    }
  }

  async confirmarAsistencia() {
    if (this.estadoActual === 'confirmado') {
      alert('✅ Ya confirmaste tu asistencia');
      return;
    }

    if (!this.invitadoId) {
      alert(
        '❌ Error: No se encontró tu invitación. Por favor, abre el enlace correcto.',
      );
      return;
    }

    const confirmar = confirm('🎉 ¿Confirmas tu asistencia?');
    if (!confirmar) return;

    this.confirmando = true;
    try {
      await this.invitadosService.actualizarInvitado(this.invitadoId, {
        estado: 'confirmado',
      });
      this.estadoActual = 'confirmado';
      alert('✅ ¡Asistencia confirmada! Te esperamos 🎉');
    } catch (error) {
      console.error('Error al confirmar:', error);
      alert('❌ Error al confirmar. Intenta de nuevo.');
    } finally {
      this.confirmando = false;
    }
  }

  async rechazarAsistencia() {
    if (this.estadoActual === 'rechazado') {
      alert('✅ Ya confirmaste que no asistirás');
      return;
    }

    if (!this.invitadoId) {
      alert(
        '❌ Error: No se encontró tu invitación. Por favor, abre el enlace correcto.',
      );
      return;
    }

    const rechazar = confirm('💔 ¿Confirmas que NO podrás asistir?');
    if (!rechazar) return;

    this.confirmando = true;
    try {
      await this.invitadosService.actualizarInvitado(this.invitadoId, {
        estado: 'rechazado',
      });
      this.estadoActual = 'rechazado';
      alert('💔 Gracias por avisar. ¡Te extrañaremos!');
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert('❌ Error al rechazar. Intenta de nuevo.');
    } finally {
      this.confirmando = false;
    }
  }

  guardarEnCalendario() {
    const fecha = this.eventoData.fecha
      ? new Date(this.eventoData.fecha)
      : new Date();
    const fechaInicio = this.formatearFechaParaCalendar(fecha);
    const fechaFin = this.formatearFechaParaCalendar(
      new Date(fecha.getTime() + 4 * 60 * 60 * 1000),
    );

    const titulo = encodeURIComponent(`${this.eventoData.name || 'Evento'}`);
    const descripcion = encodeURIComponent(
      `${this.eventoData.mensajePrincipal || 'Te esperamos'}`,
    );
    const ubicacion = encodeURIComponent(this.eventoData.lugar || '');

    const urlCalendario = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${fechaInicio}/${fechaFin}&details=${descripcion}&location=${ubicacion}`;

    window.open(urlCalendario, '_blank');
  }

  private formatearFechaParaCalendar(fecha: Date): string {
    return fecha.toISOString().replace(/-|:|\./g, '');
  }
}
