import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core'; // 👈 IMPORTAR

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon, // 👈 AGREGAR
  ],
  templateUrl: './hero-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent implements OnInit, OnChanges {
  @Input() nombres!: string;
  @Input() fecha!: string;
  @Input() lugar!: string;
  @Input() heroImage!: string;
  @Input() heroImageMovil?: string; // 👈 Imagen para móvil
  @Input() heroImageEscritorio?: string; // 👈 Imagen para escritorio
  @Input() fuente: string = 'Playfair Display, serif';
  @Input() colorTexto: string = '#ffffff';
  @Input() animacion: string = 'shimmer';

  imagenSeleccionada: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.actualizarImagenSegunDispositivo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animacion']) {
    }
  }
  /**
   * Desplaza la página suavemente hasta la siguiente sección
   */
  scrollToNextSection() {
    // Buscar el siguiente elemento después del Hero
    const heroElement = this.el.nativeElement;
    const nextElement = heroElement.nextElementSibling;

    if (nextElement) {
      nextElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // Si no hay siguiente elemento, hacer scroll al 100vh
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  }
  get fechaFormateadaObj(): { dia: string; mes: string; anio: string } {
    if (!this.fecha) {
      return { dia: '', mes: '', anio: '' };
    }

    let dia = '';
    let mes = '';
    let anio = '';

    // Si es formato "19/12/2026" (DD/MM/YYYY)
    if (typeof this.fecha === 'string' && this.fecha.includes('/')) {
      const partes = this.fecha.split('/');
      if (partes.length === 3) {
        dia = partes[0].padStart(2, '0'); // "19"
        const mesNumero = parseInt(partes[1]); // 12
        anio = partes[2]; // "2026"

        // Convertir número de mes a nombre
        const meses = [
          'enero',
          'febrero',
          'marzo',
          'abril',
          'mayo',
          'junio',
          'julio',
          'agosto',
          'septiembre',
          'octubre',
          'noviembre',
          'diciembre',
        ];
        mes = meses[mesNumero - 1] || '';

        return { dia, mes, anio };
      }
    }

    // Si es "19 de diciembre de 2026"
    if (typeof this.fecha === 'string' && this.fecha.includes('de')) {
      const partes = this.fecha.split(' de ');
      if (partes.length === 3) {
        dia = partes[0].trim().padStart(2, '0');
        mes = partes[1].trim();
        anio = partes[2].trim();
        return { dia, mes, anio };
      }
    }

    // Si es formato ISO, convertirlo
    let fechaDate: Date;
    if (typeof this.fecha === 'string') {
      fechaDate = new Date(this.fecha);
    } else {
      fechaDate = this.fecha;
    }

    if (isNaN(fechaDate.getTime())) {
      return { dia: '', mes: '', anio: '' };
    }

    dia = fechaDate.getDate().toString().padStart(2, '0');
    mes = fechaDate.toLocaleString('es-MX', { month: 'long' });
    anio = fechaDate.getFullYear().toString();

    return { dia, mes, anio };
  }
  // hero-section.component.ts

  @HostListener('window:resize')
  actualizarImagenSegunDispositivo() {
    const isMobile = window.innerWidth <= 768;

    // 👈 ASIGNAR A imagenSeleccionada, NO a heroImage
    if (isMobile && this.heroImageMovil) {
      this.imagenSeleccionada = this.heroImageMovil;
    } else if (!isMobile && this.heroImageEscritorio) {
      this.imagenSeleccionada = this.heroImageEscritorio;
    } else {
      this.imagenSeleccionada =
        this.heroImageMovil || this.heroImageEscritorio || this.heroImage || '';
    }

    console.log('📐 Imagen seleccionada:', this.imagenSeleccionada);
  }
}
