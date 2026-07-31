// src/app/components/invitaciones/invitacion-generica/sections/consideraciones-section/consideraciones-section.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Consideraciones,
  ItemConsideracion,
  ESTILOS_CONSIDERACIONES,
} from '../../../../../models/consideraciones.model';

@Component({
  selector: 'app-consideraciones-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consideraciones-section.component.html',
  styleUrls: ['./consideraciones-section.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ConsideracionesSectionComponent implements OnInit {
  // ==============================================================
  // INPUTS Y OUTPUTS
  // ==============================================================

  @Input() data!: Consideraciones;
  @Input() modo: 'edicion' | 'vista' = 'edicion';
  @Output() dataChange = new EventEmitter<Consideraciones>();

  // ==============================================================
  // PROPIEDADES
  // ==============================================================

  estilos = ESTILOS_CONSIDERACIONES;

  // ==============================================================
  // CICLO DE VIDA
  // ==============================================================

  ngOnInit() {
    if (!this.data) {
      this.data = {
        mostrarSeccion: true,
        estilo: 'iconos',
        titulo: 'Consideraciones',
        subtitulo: 'Para que todo salga perfecto',
        mensajeIntro:
          'Gracias por ser parte de este momento tan especial. Te compartimos algunas recomendaciones importantes.',
        colorIconos: '#c9a87c',
        items: [],
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

  /** Agrega una nueva consideración */
  agregarItem() {
    if (!this.data.items) {
      this.data.items = [];
    }
    this.data.items.push({
      titulo: '',
      descripcion: '',
      icono: '📌',
    });
    this.emitirCambios();
  }

  /** Elimina una consideración */
  eliminarItem(index: number) {
    if (this.data.items) {
      this.data.items.splice(index, 1);
      this.emitirCambios();
    }
  }

  /** Obtiene un icono según el título */
  getIconoItem(titulo: string): string {
    const iconos: { [key: string]: string } = {
      tiempo: '⏰',
      llegada: '🚗',
      vestimenta: '👔',
      confirmar: '✅',
      asistencia: '📋',
      niños: '👶',
      supervisión: '👀',
      celulares: '📱',
      teléfonos: '📱',
      estacionamiento: '🅿️',
      disfruta: '🎉',
      momento: '💫',
      llegar: '🚗',
      código: '👔',
      confirma: '✅',
      niño: '👶',
      estaciona: '🅿️',
    };
    const lower = titulo.toLowerCase();
    for (const [key, icon] of Object.entries(iconos)) {
      if (lower.includes(key)) {
        return icon;
      }
    }
    return '📌';
  }
}
