// ================================================================
// GALERÍA - COMPONENTE
// ================================================================

import {
  Component,
  Input,
  Output,
  EventEmitter, // ✅ AGREGAR
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Galeria } from '../../../../../models/galeria.model';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-galeria-section',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './galeria-section.component.html',
  styleUrls: ['./galeria-section.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class GaleriaSectionComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() data!: Galeria;

  // ✅ DESPUÉS
  @Output() abrirModalEvent = new EventEmitter<{
    foto: string;
    indice: number;
    total: number;
    efecto: string;
  }>();

  // ✅ Método completo
  abrirModal(index: number) {
    if (this.fotos.length === 0) return;

    this.abrirModalEvent.emit({
      foto: this.fotos[index],
      indice: index,
      total: this.fotos.length,
      efecto: this.efectoClase,
    });
  }
  @ViewChild('galeriaContainer') galeriaContainer!: ElementRef;

  // ✅ ESTAS PROPIEDADES SE MANTIENEN
  indiceActual = 0;
  public autoplayInterval: any = null;
  private isTransitioning = false;
  private actualizandoPorFlecha = false;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private isSwiping: boolean = false;

  // ==============================================================
  // GETTERS (TODO IGUAL)
  // ==============================================================

  get fotos(): string[] {
    return this.data?.fotos?.map((f) => f.url) || [];
  }

  get estiloGrid(): string {
    const estilos: Record<string, string> = {
      grid: 'galeria-grid',
      masonry: 'galeria-masonry',
      carousel: 'galeria-carousel',
      album: 'galeria-album',
      slideshow: 'galeria-slideshow',
    };
    return estilos[this.data?.estilo || 'grid'] || 'galeria-grid';
  }

  get efectoClase(): string {
    return this.data?.efecto || 'slide';
  }

  get velocidadMs(): string {
    return (this.data?.velocidad || 300) + 'ms';
  }

  get velocidadAutoplay(): number {
    return this.data?.velocidad || 3000;
  }

  get autoplayActivo(): boolean {
    const estilo = this.data?.estilo || 'grid';
    return (
      (estilo === 'carousel' || estilo === 'slideshow') &&
      this.data?.mostrarControles !== true
    );
  }

  get controlesDestacados(): boolean {
    const estilo = this.data?.estilo || 'grid';
    return estilo === 'carousel' || estilo === 'slideshow';
  }

  get totalFotos(): number {
    return this.fotos.length;
  }

  // ==============================================================
  // CICLO DE VIDA (TODO IGUAL)
  // ==============================================================

  ngOnInit() {
    if (this.autoplayActivo) {
      setTimeout(() => this.iniciarAutoplay(), 1000);
    }
  }

  ngAfterViewInit() {
    const container = this.galeriaContainer?.nativeElement;
    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      container.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngOnDestroy() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
    const container = this.galeriaContainer?.nativeElement;
    if (container) {
      container.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  // ==============================================================
  // AUTOPLAY (TODO IGUAL)
  // ==============================================================

  iniciarAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    if (!this.autoplayActivo || this.totalFotos === 0) return;

    this.autoplayInterval = setInterval(() => {
      if (!this.isTransitioning) {
        this.slideSiguienteConLoop();
      }
    }, this.velocidadAutoplay);
  }

  slideSiguienteConLoop() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0) return;

    const siguienteIndice = (this.indiceActual + 1) % total;
    const esLoop = siguienteIndice === 0;

    this.indiceActual = siguienteIndice;

    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;
      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;
      const targetScroll = siguienteIndice * (itemWidth + gap);

      if (esLoop) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }

      setTimeout(() => {
        this.isTransitioning = false;
      }, 400);
    }
  }

  toggleAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    } else {
      this.iniciarAutoplay();
    }
  }

  // ==============================================================
  // NAVEGACIÓN POR SCROLL (TODO IGUAL)
  // ==============================================================

  onScroll(event: Event) {
    if (this.actualizandoPorFlecha) return;

    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const itemWidth =
      container.querySelector('.galeria-item')?.clientWidth || 0;
    const gap = 16;
    const index = Math.round(scrollLeft / (itemWidth + gap));

    if (index !== this.indiceActual && index < this.totalFotos && index >= 0) {
      this.indiceActual = index;
    }
  }

  slideAnterior() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0) return;

    this.actualizandoPorFlecha = true;
    const anteriorIndice = (this.indiceActual - 1 + total) % total;
    this.indiceActual = anteriorIndice;

    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;
      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;
      const targetScroll = anteriorIndice * (itemWidth + gap);

      container.scrollTo({ left: targetScroll, behavior: 'smooth' });

      setTimeout(() => {
        this.isTransitioning = false;
        this.actualizandoPorFlecha = false;
      }, 400);
    }
  }

  slideSiguiente() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0) return;

    this.actualizandoPorFlecha = true;
    const siguienteIndice = (this.indiceActual + 1) % total;
    this.indiceActual = siguienteIndice;

    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;
      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;
      const targetScroll = siguienteIndice * (itemWidth + gap);

      container.scrollTo({ left: targetScroll, behavior: 'smooth' });

      setTimeout(() => {
        this.isTransitioning = false;
        this.actualizandoPorFlecha = false;
      }, 400);
    }
  }

  irASlide(index: number) {
    if (index === this.indiceActual || index < 0 || index >= this.totalFotos)
      return;

    this.indiceActual = index;

    const container = this.galeriaContainer?.nativeElement;
    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;
      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;

      container.scrollTo({
        left: index * (itemWidth + gap),
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.isTransitioning = false;
      }, 400);
    }
  }

  // ❌ ELIMINAR estos métodos (ya no se usan)
  // cerrarModal() { ... }
  // anterior() { ... }
  // siguiente() { ... }
  // reproducirAnimacion() { ... }

  // ==============================================================
  // EVENTOS DE TOUCH (TODO IGUAL)
  // ==============================================================

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.isSwiping = true;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.touchEndX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.isSwiping = false;

    const diffX = this.touchStartX - this.touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        this.slideSiguiente();
      } else {
        this.slideAnterior();
      }
    }
  }
}
