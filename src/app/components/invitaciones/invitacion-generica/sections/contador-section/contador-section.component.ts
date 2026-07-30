import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Contador,
  ESTILOS_CONTADOR,
} from '../../../../../models/contador.model';

@Component({
  selector: 'app-contador-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contador-section.component.html',
  styleUrls: ['./contador-section.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ContadorSectionComponent implements OnInit, OnDestroy {
  // ==============================================================
  // INPUTS Y OUTPUTS
  // ==============================================================

  @Input() data!: Contador;
  @Input() modo: 'edicion' | 'vista' = 'edicion';
  @Output() dataChange = new EventEmitter<Contador>();

  // ==============================================================
  // PROPIEDADES
  // ==============================================================

  estilos = ESTILOS_CONTADOR;
  private intervalId: any = null;

  // Tiempo restante
  dias: number = 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;

  // ==============================================================
  // GETTERS Y SETTERS
  // ==============================================================

  get fechaEvento(): string {
    return this.data?.fechaEvento || '';
  }

  set fechaEvento(value: string) {
    if (this.data) {
      this.data.fechaEvento = value;
      this.emitirCambios();
      this.calcularTiempoRestante();
    }
  }

  // ==============================================================
  // CICLO DE VIDA
  // ==============================================================

  ngOnInit() {
    if (!this.data) {
      this.data = {
        mostrarSeccion: true,
        fechaEvento: '',
        estilo: 'clasico',
        titulo: 'Faltan para nuestro gran día',
        mensaje: '¡No podemos esperar para celebrar contigo!',
        colorPrincipal: '#c9a87c',
        colores: {
          dias: '#5c3d2e',
          horas: '#8b6b4a',
          minutos: '#c9a87c',
          segundos: '#e8d5c0',
        },
        etiquetas: {
          dias: 'DÍAS',
          horas: 'HORAS',
          minutos: 'MINUTOS',
          segundos: 'SEGUNDOS',
        },
      };
      this.emitirCambios();
    }

    this.calcularTiempoRestante();
    this.iniciarContador();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ==============================================================
  // MÉTODOS DEL CONTADOR
  // ==============================================================

  /** Inicia el contador que actualiza cada segundo */
  iniciarContador() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.calcularTiempoRestante();
    }, 1000);
  }

  /** Calcula el tiempo restante hasta la fecha del evento */
  calcularTiempoRestante() {
    if (!this.data?.fechaEvento) {
      this.dias = 0;
      this.horas = 0;
      this.minutos = 0;
      this.segundos = 0;
      return;
    }

    const fechaEvento = new Date(this.data.fechaEvento);
    const ahora = new Date();
    const diferencia = fechaEvento.getTime() - ahora.getTime();

    if (diferencia <= 0) {
      this.dias = 0;
      this.horas = 0;
      this.minutos = 0;
      this.segundos = 0;
      return;
    }

    this.dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    this.horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    this.minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    this.segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  }

  /** Formatea un número con dos dígitos */
  formatearNumero(num: number): string {
    return num.toString().padStart(2, '0');
  }

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

  /** Formatea la fecha para mostrar en la vista */
  get fechaFormateada(): string {
    if (!this.data?.fechaEvento) return '';
    const fecha = new Date(this.data.fechaEvento);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
