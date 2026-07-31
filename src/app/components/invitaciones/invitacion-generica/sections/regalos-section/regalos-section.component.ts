// src/app/components/invitaciones/invitacion-generica/sections/regalos-section/regalos-section.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 ESTE IMPORT FALTA
import { Regalos, ESTILOS_REGALOS } from '../../../../../models/regalos.model';

@Component({
  selector: 'app-regalos-section',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 AQUÍ FALTA FormsModule
  templateUrl: './regalos-section.component.html',
  styleUrls: ['./regalos-section.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RegalosSectionComponent implements OnInit {
  // ==============================================================
  // INPUTS Y OUTPUTS
  // ==============================================================

  @Input() data!: Regalos;
  @Input() modo: 'edicion' | 'vista' = 'edicion';
  @Output() dataChange = new EventEmitter<Regalos>();

  // ==============================================================
  // PROPIEDADES
  // ==============================================================

  estilos = ESTILOS_REGALOS;

  // ==============================================================
  // CICLO DE VIDA
  // ==============================================================

  ngOnInit() {
    if (!this.data) {
      this.data = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Mesa de Regalos',
        descripcion:
          'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, encontrarás nuestras opciones aquí.',
        opciones: [],
        textoBoton: 'Ver mesa de regalos',
      };
      this.emitirCambios();
    }
  }

  // ==============================================================
  // MÉTODOS
  // ==============================================================

  /** Emite los cambios al componente padre */
  emitirCambios() {
    this.dataChange.emit(this.data);
  }

  /** Alterna mostrar/ocultar sección */
  toggleMostrarSeccion() {
    this.data.mostrarSeccion = !this.data.mostrarSeccion;
    this.emitirCambios();
  }

  /** Selecciona un estilo */
  seleccionarEstilo(estilo: string) {
    this.data.estilo = estilo as any;
    this.emitirCambios();
  }

  /** Agrega una nueva opción de regalo */
  agregarOpcion() {
    if (!this.data.opciones) {
      this.data.opciones = [];
    }
    this.data.opciones.push({
      nombre: '',
      subtitulo: '',
      icono: '🎁',
    });
    this.emitirCambios();
  }

  /** Elimina una opción de regalo */
  eliminarOpcion(index: number) {
    if (this.data.opciones) {
      this.data.opciones.splice(index, 1);
      this.emitirCambios();
    }
  }

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
