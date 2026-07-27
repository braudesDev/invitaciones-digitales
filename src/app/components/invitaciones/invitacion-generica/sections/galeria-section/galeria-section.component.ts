// src/app/components/invitaciones/invitacion-generica/sections/galeria-section/galeria-section.component.ts

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Galeria } from '../../../../../models/galeria.model';

@Component({
  selector: 'app-galeria-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria-section.component.html',
  styleUrls: ['./galeria-section.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class GaleriaSectionComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() data!: Galeria;
  @ViewChild('galeriaContainer') galeriaContainer!: ElementRef;

  modalAbierto = false;
  fotoActual = '';
  indiceActual = 0;
  public autoplayInterval: any = null;
  private isTransitioning = false;

  // ============================================
  // GETTERS
  // ============================================

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
      this.data?.mostrarControles !== false
    );
  }

  get controlesDestacados(): boolean {
    const estilo = this.data?.estilo || 'grid';
    return estilo === 'carousel' || estilo === 'slideshow';
  }

  get totalFotos(): number {
    return this.fotos.length;
  }

  // ============================================
  // CICLO DE VIDA
  // ============================================

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

  // ============================================
  // AUTOPLAY CON LOOP INFINITO (CORREGIDO)
  // ============================================

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

    // Calcular el siguiente índice
    const siguienteIndice = (this.indiceActual + 1) % total;
    const esLoop = siguienteIndice === 0;

    // Actualizar el índice y la foto primero
    this.indiceActual = siguienteIndice;
    this.fotoActual = this.fotos[siguienteIndice];

    // Para carrusel y slideshow, hacer scroll
    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;

      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;
      const targetScroll = siguienteIndice * (itemWidth + gap);

      // Si es loop (volver al principio), scroll al inicio
      if (esLoop) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      } else {
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });
      }

      // Desbloquear después de la transición
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

  // ============================================
  // NAVEGACIÓN (CORREGIDA)
  // ============================================

  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const itemWidth =
      container.querySelector('.galeria-item')?.clientWidth || 0;
    const gap = 16;
    const index = Math.round(scrollLeft / (itemWidth + gap));

    if (index !== this.indiceActual && index < this.totalFotos && index >= 0) {
      this.indiceActual = index;
      this.fotoActual = this.fotos[index];
    }
  }

  slideAnterior() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0) return;

    // Calcular el índice anterior
    const anteriorIndice = (this.indiceActual - 1 + total) % total;

    // Actualizar el índice y la foto
    this.indiceActual = anteriorIndice;
    this.fotoActual = this.fotos[anteriorIndice];

    // Para carrusel y slideshow, hacer scroll
    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;

      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;
      const targetScroll = anteriorIndice * (itemWidth + gap);

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.isTransitioning = false;
      }, 400);
    }
  }

  slideSiguiente() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0) return;

    // Calcular el siguiente índice
    const siguienteIndice = (this.indiceActual + 1) % total;

    // Actualizar el índice y la foto
    this.indiceActual = siguienteIndice;
    this.fotoActual = this.fotos[siguienteIndice];

    // Para carrusel y slideshow, hacer scroll
    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;

      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;
      const targetScroll = siguienteIndice * (itemWidth + gap);

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.isTransitioning = false;
      }, 400);
    }
  }

  irASlide(index: number) {
    if (index === this.indiceActual || index < 0 || index >= this.totalFotos)
      return;

    // Actualizar el índice y la foto
    this.indiceActual = index;
    this.fotoActual = this.fotos[index];

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

  // ============================================
  // COMPARTIR
  // ============================================

  compartirGaleria() {
    if (navigator.share) {
      navigator
        .share({
          title: this.data.titulo || 'Nuestros Momentos',
          text: this.data.descripcion || 'Mira estos momentos especiales',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert('📋 ¡Enlace copiado al portapapeles!');
        })
        .catch(() => {});
    }
  }

  // ============================================
  // MODAL
  // ============================================

  abrirModal(index: number) {
    this.indiceActual = index;
    this.fotoActual = this.fotos[index];
    this.modalAbierto = true;
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
    if (this.autoplayActivo && !this.autoplayInterval) {
      this.iniciarAutoplay();
    }
  }

  anterior() {
    this.indiceActual =
      (this.indiceActual - 1 + this.totalFotos) % this.totalFotos;
    this.fotoActual = this.fotos[this.indiceActual];
  }

  siguiente() {
    this.indiceActual = (this.indiceActual + 1) % this.totalFotos;
    this.fotoActual = this.fotos[this.indiceActual];
  }
}
