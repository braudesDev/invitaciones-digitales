// historia-section.component.ts

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Historia {
  mostrarSeccion: boolean;
  estilo: 'timeline' | 'tarjetas' | 'album' | 'minimalista';
  titulo: string;
  descripcion: string;
  momentos: { fecha: string; descripcion: string; imagen?: string }[];
}

@Component({
  selector: 'app-historia-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./historia-section.component.css'],
})
export class HistoriaSectionComponent {
  @Input() data!: Historia;
}
