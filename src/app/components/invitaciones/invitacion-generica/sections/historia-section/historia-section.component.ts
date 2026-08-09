// historia-section.component.ts

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Historia } from '../../../../../models/historia.model';
import { NgIcon } from '@ng-icons/core'; // iconos

@Component({
  selector: 'app-historia-section',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './historia-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./historia-section.component.css'],
})
export class HistoriaSectionComponent {
  @Input() data!: Historia;

  verTodos = false;
  minimalistaAbierto: boolean[] = [];

  // Referencias a los contenedores
  @ViewChild('tarjetasContainer') tarjetasContainer!: ElementRef;
  @ViewChild('albumContainer') albumContainer!: ElementRef;

  // Scroll para carrusel
  scrollTarjetas(direccion: number) {
    if (this.tarjetasContainer) {
      const container = this.tarjetasContainer.nativeElement;
      const scrollAmount = 320 * direccion;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // Toggle para minimalista (acordeón)
  toggleMinimalista(index: number) {
    this.minimalistaAbierto[index] = !this.minimalistaAbierto[index];
  }
}
