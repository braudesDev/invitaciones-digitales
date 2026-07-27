import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { InvitadosService } from '../../../../../services/invitados.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invitacion-valida-section',
  standalone: true,
  imports: [],
  templateUrl: './invitacion-valida-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./invitacion-valida-section.component.css'],
})
export class InvitacionValidaSectionComponent implements OnInit {
  @Input() invitado: string = '';
  @Input() pases: number = 1;
  @Input() mensajePersonalizado?: string;
  @Input() eventoData: any = {};

  qrCodeUrl: string = '';
  invitadoId: string = '';
  estadoActual: string = 'pendiente';

  constructor(
    private invitadosService: InvitadosService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.obtenerInvitadoId();
    this.generarQR();
  }

  async obtenerInvitadoId() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.invitadosService.getInvitadoPorSlug(slug).subscribe((inv) => {
        if (inv && inv.id) {
          this.invitadoId = inv.id;
          this.estadoActual = inv.estado;
          this.generarQR(); // Regenerar QR con estado actualizado
        }
      });
    }
  }

  generarQR() {
    // Datos para el QR
    const qrData = {
      tipo: 'validacion-invitacion',
      invitadoId: this.invitadoId,
      invitado: this.invitado,
      pases: this.pases,
      evento: this.eventoData.name || 'Evento',
      eventoSlug: this.eventoData.slug || '',
      fecha: this.eventoData.fecha || new Date().toISOString(),
      lugar: this.eventoData.lugar || '',
      confirmado: this.estadoActual === 'confirmado',
      mensaje: this.mensajePersonalizado || '',
    };

    // Convertir a string
    const qrText = JSON.stringify(qrData);

    // Usar API alternativa (QR Server - más confiable)
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrText)}`;

    console.log('📱 QR generado para:', this.invitado);
    console.log('🔗 URL del QR:', this.qrCodeUrl);
  }

  descargarQR() {
    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = `qr-${this.invitado.replace(/\s/g, '-')}.png`;
    link.click();
  }
}
