import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitadosService } from '../../../../../services/invitados.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmacion-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion-section.component.html',
  styleUrls: ['./confirmacion-section.component.css']
})
export class ConfirmacionSectionComponent implements OnInit {
  @Input() eventoData: any = {};
  
  invitadoId: string = '';
  estadoActual: 'pendiente' | 'confirmado' | 'rechazado' = 'pendiente';
  confirmando = false;

  constructor(
    private invitadosService: InvitadosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.obtenerInvitadoId();
  }

  async obtenerInvitadoId() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.invitadosService.getInvitadoPorSlug(slug).subscribe(inv => {
        if (inv && inv.id) {
          this.invitadoId = inv.id;
          this.estadoActual = inv.estado;
        }
      });
    }
  }

  async confirmarAsistencia() {
    if (this.estadoActual === 'confirmado') return;
    if (!this.invitadoId) return;

    const confirmar = confirm('🎉 ¿Confirmas tu asistencia?');
    if (!confirmar) return;

    this.confirmando = true;
    try {
      await this.invitadosService.actualizarInvitado(this.invitadoId, { estado: 'confirmado' });
      this.estadoActual = 'confirmado';
      alert('✅ ¡Asistencia confirmada! Te esperamos 🎉');
    } catch (error) {
      alert('Error al confirmar, intenta de nuevo');
    } finally {
      this.confirmando = false;
    }
  }

  async rechazarAsistencia() {
    if (this.estadoActual === 'rechazado') return;
    if (!this.invitadoId) return;

    const rechazar = confirm('💔 ¿Confirmas que NO podrás asistir?');
    if (!rechazar) return;

    this.confirmando = true;
    try {
      await this.invitadosService.actualizarInvitado(this.invitadoId, { estado: 'rechazado' });
      this.estadoActual = 'rechazado';
      alert('💔 Gracias por avisar');
    } finally {
      this.confirmando = false;
    }
  }

  guardarEnCalendario() {
    const fecha = this.eventoData.fecha ? new Date(this.eventoData.fecha) : new Date();
    const fechaInicio = this.formatearFechaParaCalendar(fecha);
    const fechaFin = this.formatearFechaParaCalendar(new Date(fecha.getTime() + 4 * 60 * 60 * 1000));

    const titulo = encodeURIComponent(`${this.eventoData.name || 'Evento'}`);
    const descripcion = encodeURIComponent(`${this.eventoData.mensajePrincipal || 'Te esperamos'}`);
    const ubicacion = encodeURIComponent(this.eventoData.lugar || '');

    const urlCalendario = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${fechaInicio}/${fechaFin}&details=${descripcion}&location=${ubicacion}`;
    
    window.open(urlCalendario, '_blank');
  }

  private formatearFechaParaCalendar(fecha: Date): string {
    return fecha.toISOString().replace(/-|:|\./g, '');
  }
}
