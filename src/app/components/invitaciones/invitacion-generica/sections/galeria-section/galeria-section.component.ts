// ================================================================
// GALERÍA - COMPONENTE
// ================================================================
// Archivo: galeria-section.component.ts
// Componente: GaleriaSectionComponent
//
// Este componente maneja la lógica de la sección de galería,
// incluyendo:
// - Visualización de fotos en diferentes estilos (Grid, Masonry, Carrusel, Álbum, Slideshow)
// - Efectos de transición (Slide, Fade, Zoom, Flip)
// - Modal para ver fotos en grande
// - Autoplay para carrusel y slideshow
// - Navegación por controles, paginación y swipe táctil
// ================================================================

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
import { NgIcon } from '@ng-icons/core';

// ================================================================
// 1. DECORADOR DEL COMPONENTE
// ================================================================
@Component({
  selector: 'app-galeria-section', // Selector HTML para usar el componente
  standalone: true, // Componente standalone (no necesita NgModule)
  imports: [CommonModule, NgIcon], // Módulos importados (ngIf, ngFor, etc.)
  templateUrl: './galeria-section.component.html', // Template HTML asociado
  styleUrls: ['./galeria-section.component.css'], // Estilos CSS asociados
  changeDetection: ChangeDetectionStrategy.Eager, // Estrategia de detección de cambios
}) // Interfaces del ciclo de vida
export class GaleriaSectionComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // ==============================================================
  // 2. INPUTS Y VIEWCHILDS
  // ==============================================================

  /**
   * Datos de la galería provenientes del componente padre
   * Contiene: título, fotos, estilo, efecto, velocidad, etc.
   */
  @Input() data!: Galeria;

  /**
   * Referencia al contenedor de la galería para manipular el scroll
   * Se usa para navegar en carrusel y slideshow
   */
  @ViewChild('galeriaContainer') galeriaContainer!: ElementRef;

  // ==============================================================
  // 3. PROPIEDADES DEL COMPONENTE
  // ==============================================================

  /** Controla la visibilidad del modal de fotos en grande */
  modalAbierto = false;

  /** URL de la foto actualmente visible en el modal */
  fotoActual = '';

  /** Índice de la foto actualmente visible */
  indiceActual = 0;

  /** Referencia al intervalo de autoplay para poder detenerlo */
  public autoplayInterval: any = null;

  /** Previene múltiples transiciones simultáneas */
  private isTransitioning = false;

  /** Flag para evitar que el scroll actualice el índice mientras se usan las flechas */
  private actualizandoPorFlecha = false;

  /** Controla si estamos navegando en el modal */
  private navegandoEnModal = false;

  // ==============================================================
  // 4. VARIABLES PARA SWIPE TÁCTIL
  // ==============================================================

  /** Posición X donde comenzó el toque */
  private touchStartX: number = 0;

  /** Posición X donde terminó el toque */
  private touchEndX: number = 0;

  /** Indica si el usuario está haciendo swipe */
  private isSwiping: boolean = false;

  // ==============================================================
  // 5. GETTERS - PROPIEDADES COMPUTADAS
  // ==============================================================

  /**
   * Obtiene el array de URLs de las fotos
   * Mapea las fotos de la data para extraer solo la URL
   * @returns Array de strings con las URLs
   */
  get fotos(): string[] {
    return this.data?.fotos?.map((f) => f.url) || [];
  }

  /**
   * Obtiene la clase CSS correspondiente al estilo seleccionado
   * @returns Clase CSS para el estilo (ej: 'galeria-grid', 'galeria-masonry', etc.)
   */
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

  /**
   * Obtiene la clase CSS para el efecto de transición
   * @returns Nombre del efecto (slide, fade, zoom, flip)
   */
  get efectoClase(): string {
    return this.data?.efecto || 'slide';
  }

  /**
   * Obtiene la velocidad de transición en milisegundos (formateada para CSS)
   * @returns String con el valor en ms (ej: '300ms')
   */
  get velocidadMs(): string {
    return (this.data?.velocidad || 300) + 'ms';
  }

  /**
   * Obtiene la velocidad del autoplay (para carrusel y slideshow)
   * @returns Número en milisegundos
   */
  get velocidadAutoplay(): number {
    return this.data?.velocidad || 3000;
  }

  /**
   * Determina si el autoplay debe estar activo
   * Solo para estilos carousel o slideshow cuando los controles están habilitados
   * @returns true si el autoplay está activo
   */
  get autoplayActivo(): boolean {
    const estilo = this.data?.estilo || 'grid';
    return (
      (estilo === 'carousel' || estilo === 'slideshow') &&
      this.data?.mostrarControles !== true
    );
  }

  /**
   * Determina si los controles deben tener estilo destacado
   * @returns true para carousel y slideshow
   */
  get controlesDestacados(): boolean {
    const estilo = this.data?.estilo || 'grid';
    return estilo === 'carousel' || estilo === 'slideshow';
  }

  /**
   * Obtiene el total de fotos
   * @returns Número de fotos
   */
  get totalFotos(): number {
    return this.fotos.length;
  }

  // ==============================================================
  // 6. CICLO DE VIDA - INICIALIZACIÓN
  // ==============================================================

  /**
   * Se ejecuta cuando el componente se inicializa
   * Inicia el autoplay si está activo después de 1 segundo
   */
  ngOnInit() {
    if (this.autoplayActivo) {
      setTimeout(() => this.iniciarAutoplay(), 1000);
    }
  }

  /**
   * Se ejecuta después de que la vista se ha renderizado completamente
   * Configura los event listeners para scroll y touch
   */
  ngAfterViewInit() {
    // --- Configurar scroll para carrusel y slideshow ---
    const container = this.galeriaContainer?.nativeElement;
    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      container.addEventListener('scroll', this.onScroll.bind(this));
    }

    // --- Configurar eventos de touch para el modal (swipe) ---
    const modalContent = document.querySelector('.galeria-modal-content');
    if (modalContent) {
      modalContent.addEventListener(
        'touchstart',
        this.onTouchStart.bind(this) as any,
      );
      modalContent.addEventListener(
        'touchmove',
        this.onTouchMove.bind(this) as any,
      );
      modalContent.addEventListener(
        'touchend',
        this.onTouchEnd.bind(this) as any,
      );
    }
  }

  /**
   * Se ejecuta cuando el componente se destruye
   * Limpia los intervalos y event listeners para evitar memory leaks
   */
  ngOnDestroy() {
    // --- Limpiar intervalo de autoplay ---
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }

    // --- Eliminar event listener de scroll ---
    const container = this.galeriaContainer?.nativeElement;
    if (container) {
      container.removeEventListener('scroll', this.onScroll.bind(this));
    }

    // --- Eliminar event listeners de touch ---
    const modalContent = document.querySelector('.galeria-modal-content');
    if (modalContent) {
      modalContent.removeEventListener(
        'touchstart',
        this.onTouchStart.bind(this) as any,
      );
      modalContent.removeEventListener(
        'touchmove',
        this.onTouchMove.bind(this) as any,
      );
      modalContent.removeEventListener(
        'touchend',
        this.onTouchEnd.bind(this) as any,
      );
    }
  }

  // ==============================================================
  // 7. AUTOPLAY CON LOOP INFINITO
  // ==============================================================

  /**
   * Inicia el autoplay para carrusel y slideshow
   * Crea un intervalo que avanza a la siguiente foto cada X milisegundos
   */
  iniciarAutoplay() {
    // Limpiar intervalo existente para evitar duplicados
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }

    // No iniciar si no está activo o no hay fotos
    if (!this.autoplayActivo || this.totalFotos === 0) return;

    // Crear nuevo intervalo
    this.autoplayInterval = setInterval(() => {
      if (!this.isTransitioning) {
        this.slideSiguienteConLoop();
      }
    }, this.velocidadAutoplay);
  }

  /**
   * Avanza a la siguiente foto con loop infinito
   * Cuando llega al final, vuelve al principio
   */
  slideSiguienteConLoop() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0) return;

    // Calcular el siguiente índice (con loop al final)
    const siguienteIndice = (this.indiceActual + 1) % total;
    const esLoop = siguienteIndice === 0;

    // Actualizar el índice y la foto
    this.indiceActual = siguienteIndice;
    this.fotoActual = this.fotos[siguienteIndice];

    // Para carrusel y slideshow, hacer scroll suave
    if (
      container &&
      (this.data?.estilo === 'carousel' || this.data?.estilo === 'slideshow')
    ) {
      this.isTransitioning = true;

      // Calcular el ancho de cada item
      const itemWidth =
        container.querySelector('.galeria-item')?.clientWidth || 300;
      const gap = 16;
      const targetScroll = siguienteIndice * (itemWidth + gap);

      // Scroll al objetivo (o al inicio si es loop)
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

  /**
   * Alterna el autoplay (pausa/reanuda)
   * Si está activo, lo detiene; si está detenido, lo inicia
   */
  toggleAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    } else {
      this.iniciarAutoplay();
    }
  }

  // ==============================================================
  // 8. NAVEGACIÓN POR SCROLL
  // ==============================================================

  /**
   * Evento de scroll del contenedor
   * Actualiza el índice de la foto según la posición del scroll
   * @param event - Evento de scroll del contenedor
   */
  onScroll(event: Event) {
    //  Ignorar si el modal está abierto o navegando con flecha
    if (this.modalAbierto || this.actualizandoPorFlecha) return;

    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;

    // Calcular el ancho de cada item
    const itemWidth =
      container.querySelector('.galeria-item')?.clientWidth || 0;
    const gap = 16;
    const index = Math.round(scrollLeft / (itemWidth + gap));

    // Actualizar índice si cambió y está dentro del rango
    if (index !== this.indiceActual && index < this.totalFotos && index >= 0) {
      this.indiceActual = index;
      this.fotoActual = this.fotos[index];
    }
  }

  /**
   * Navega a la foto anterior
   * Con loop al principio (si es la primera, va a la última)
   */
  slideAnterior() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0 || this.modalAbierto) return;

    this.actualizandoPorFlecha = true;

    // Calcular el índice anterior (con loop)
    const anteriorIndice = (this.indiceActual - 1 + total) % total;

    // Actualizar el índice y la foto
    this.indiceActual = anteriorIndice;
    this.fotoActual = this.fotos[anteriorIndice];

    // Para carrusel y slideshow, hacer scroll suave
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

      setTimeout(() => {
        this.actualizandoPorFlecha = false;
      }, 400);
    }
  }

  /**
   * Navega a la siguiente foto
   * Con loop al final (si es la última, va a la primera)
   */
  slideSiguiente() {
    const container = this.galeriaContainer?.nativeElement;
    const total = this.totalFotos;

    if (total === 0 || this.modalAbierto) return;

    this.actualizandoPorFlecha = true;

    // Calcular el siguiente índice (con loop)
    const siguienteIndice = (this.indiceActual + 1) % total;

    // Actualizar el índice y la foto
    this.indiceActual = siguienteIndice;
    this.fotoActual = this.fotos[siguienteIndice];

    // Para carrusel y slideshow, hacer scroll suave
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
      setTimeout(() => {
        this.actualizandoPorFlecha = false;
      }, 400);
    }
  }

  /**
   * Navega a un slide específico por índice
   * @param index - Índice de la foto a mostrar
   */
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

  // ==============================================================
  // 9. EVENTOS DE TOUCH PARA SWIPE (en modal)
  // ==============================================================

  /**
   * Evento cuando el usuario comienza a tocar la pantalla
   * Registra la posición inicial del toque
   * @param event - Evento táctil
   */
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.isSwiping = true;
  }

  /**
   * Evento cuando el usuario mueve el dedo sobre la pantalla
   * Registra la posición actual del toque
   * @param event - Evento táctil
   */
  onTouchMove(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.touchEndX = event.changedTouches[0].screenX;
  }

  /**
   * Evento cuando el usuario levanta el dedo de la pantalla
   * Determina si fue un swipe y navega en consecuencia
   * @param event - Evento táctil
   */
  onTouchEnd(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.isSwiping = false;

    const diffX = this.touchStartX - this.touchEndX;
    const minSwipeDistance = 50; // Distancia mínima para considerar swipe

    // Si el swipe fue suficientemente largo
    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe hacia la izquierda → siguiente foto
        this.siguiente();
      } else {
        // Swipe hacia la derecha → foto anterior
        this.anterior();
      }
    }
  }

  // ==============================================================
  // 10. MÉTODOS DEL MODAL (CORREGIDOS)
  // ==============================================================

  /**
   * Abre el modal para ver una foto en grande
   * @param index - Índice de la foto a mostrar
   */
  abrirModal(index: number) {
    if (this.fotos.length === 0) return;

    this.actualizandoPorFlecha = true;

    // ✅ Asegurar que el índice esté dentro del rango
    this.indiceActual = Math.max(0, Math.min(index, this.fotos.length - 1));
    this.fotoActual = this.fotos[this.indiceActual];
    this.modalAbierto = true;

    // Resetear la animación
    const img = document.querySelector('.modal-imagen');
    if (img) {
      img.classList.remove(
        'efecto-slide',
        'efecto-fade',
        'efecto-zoom',
        'efecto-flip',
      );
      void (img as HTMLElement).offsetWidth;
      img.classList.add('efecto-' + this.efectoClase);
    }

    // Pausar autoplay
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }

    setTimeout(() => {
      this.actualizandoPorFlecha = false;
    }, 300);
  }

  /**
   * Cierra el modal de fotos en grande
   */
  cerrarModal() {
    this.modalAbierto = false;
    // ✅ AGREGAR ESTA LÍNEA - Reactivar scroll del carrusel
    this.actualizandoPorFlecha = false;
    // ✅ AGREGAR ESTA LÍNEA - Resetear flag de navegación
    this.navegandoEnModal = false;

    if (this.autoplayActivo && !this.autoplayInterval) {
      this.iniciarAutoplay();
    }
  }

  /**
   * Navega a la foto anterior dentro del modal
   * Con loop al principio
   */
  anterior() {
    // ✅ AGREGAR ESTA LÍNEA - Prevenir múltiples clicks
    if (this.fotos.length === 0 || this.navegandoEnModal) return;

    // ✅ AGREGAR ESTA LÍNEA - Activar flag de navegación
    this.navegandoEnModal = true;

    const nuevoIndice =
      (this.indiceActual - 1 + this.fotos.length) % this.fotos.length;

    if (nuevoIndice !== this.indiceActual) {
      this.indiceActual = nuevoIndice;
      this.fotoActual = this.fotos[this.indiceActual];
      this.reproducirAnimacion();
    }

    // ✅ AGREGAR ESTE setTimeout - Desbloquear después de la transición
    setTimeout(() => {
      this.navegandoEnModal = false;
    }, 300);
  }

  /**
   * Navega a la siguiente foto dentro del modal
   * Con loop al final
   */
  siguiente() {
    // ✅ AGREGAR ESTA LÍNEA - Prevenir múltiples clicks
    if (this.fotos.length === 0 || this.navegandoEnModal) return;

    // ✅ AGREGAR ESTA LÍNEA - Activar flag de navegación
    this.navegandoEnModal = true;

    const nuevoIndice = (this.indiceActual + 1) % this.fotos.length;

    if (nuevoIndice !== this.indiceActual) {
      this.indiceActual = nuevoIndice;
      this.fotoActual = this.fotos[this.indiceActual];
      this.reproducirAnimacion();
    }

    // ✅ AGREGAR ESTE setTimeout - Desbloquear después de la transición
    setTimeout(() => {
      this.navegandoEnModal = false;
    }, 300);
  }

  /**
   * Reproduce la animación de transición al cambiar de foto en el modal (MEJORADO)
   */
  private reproducirAnimacion() {
    const img = document.querySelector('.modal-imagen');
    if (img) {
      // ✅ Quitar clases de animación anteriores
      img.classList.remove(
        'efecto-slide',
        'efecto-fade',
        'efecto-zoom',
        'efecto-flip',
      );

      // ✅ Forzar reflow
      void (img as HTMLElement).offsetWidth;

      // ✅ Agregar la clase del efecto actual
      img.classList.add('efecto-' + this.efectoClase);

      // ✅ También actualizar el atributo src para forzar recarga
      const imgElement = img as HTMLImageElement;
      if (imgElement.src !== this.fotoActual) {
        imgElement.src = this.fotoActual;
      }
    }
  }
}
