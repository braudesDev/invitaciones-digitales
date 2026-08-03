// src/app/components/invitaciones/invitacion-generica/sections/regalos-section/regalos-section.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Regalos } from '../../../../../models/regalos.model';

@Component({
  selector: 'app-regalos-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './regalos-section.component.html',
  styleUrls: ['./regalos-section.component.css'],
})
export class RegalosSectionComponent {
  @Input() data!: Regalos;
  @Input() fontFamily: string = "'Playfair Display', Georgia, serif";

  /** Obtiene un icono según el nombre de la opción */
  getIconoOpcion(nombre: string): string {
    const iconos: { [key: string]: string } = {
      liverpool: '🏬',
      amazon: '📦',
      lluvia: '💵',
      sobres: '✉️',
      transferencia: '🏦',
      banco: '🏦',
      paypal: '💳',
      mercado: '🛒',
    };
    const lower = nombre.toLowerCase();
    for (const [key, icon] of Object.entries(iconos)) {
      if (lower.includes(key)) {
        return icon;
      }
    }
    return '🎁';
  }
}
