// src/app/components/invitaciones/invitacion-generica/sections/dresscode-section/dresscode-section.component.ts

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import {
  DressCode,
  getEstiloNombre,
  getEstiloIcon,
  getEstiloDescripcion,
} from '../../../../../models/dress-code.model';

@Component({
  selector: 'app-dresscode-section',
  standalone: true,
  imports: [],
  templateUrl: './dresscode-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./dresscode-section.component.css'],
})
export class DresscodeSectionComponent {
  @Input() data!: DressCode;

  // 👇 Métodos helper para usar en el template
  getEstiloNombre = getEstiloNombre;
  getEstiloIcon = getEstiloIcon;
  getEstiloDescripcion = getEstiloDescripcion;

  // 👇 Verificar si hay colores sugeridos
  get tieneColores(): boolean {
    return this.data?.colores && this.data.colores.length > 0;
  }

  // 👇 VERIFICAR SI HAY COLORES RESERVADOS (AGREGAR)
  get tieneColoresReservados(): boolean {
    return !!(
      this.data?.coloresReservados && this.data.coloresReservados.length > 0
    );
  }

  get tieneNotaAdicional(): boolean {
    return !!(
      this.data?.notaAdicional && this.data.notaAdicional.trim().length > 0
    );
  }
}
