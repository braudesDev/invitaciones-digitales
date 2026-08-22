import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invitacion } from '../../../services/invitaciones.service';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { NosCasamosSectionComponent } from './sections/nos-casamos-section/nos-casamos-section.component';
import { InvitacionValidaSectionComponent } from './sections/invitacion-valida-section/invitacion-valida-section.component';
import { CeremoniaSectionComponent } from './sections/ceremonia-section/ceremonia-section.component';
import { PadresSectionComponent } from './sections/padres-section/padres-section.component';
import { PadrinosSectionComponent } from './sections/padrinos-section/padrinos-section.component';
import { DamasSectionComponent } from './sections/damas-section/damas-section.component';
import { DresscodeSectionComponent } from './sections/dresscode-section/dresscode-section.component';
import { HistoriaSectionComponent } from './sections/historia-section/historia-section.component';
import { ItinerarioSectionComponent } from './sections/itinerario-section/itinerario-section.component';
import { HospedajeSectionComponent } from './sections/hospedaje-section/hospedaje-section.component';
import { HashtagSectionComponent } from './sections/hashtag-section/hashtag-section.component';
import { ContadorSectionComponent } from './sections/contador-section/contador-section.component';
import { RegalosSectionComponent } from './sections/regalos-section/regalos-section.component';
import { ConsideracionesSectionComponent } from './sections/consideraciones-section/consideraciones-section.component';
import { ConfirmacionSectionComponent } from './sections/confirmacion-section/confirmacion-section.component';
import { FooterSectionComponent } from './sections/footer-section/footer-section.component';
import { GaleriaSectionComponent } from './sections/galeria-section/galeria-section.component';
import { PadrinoAsignado } from '../../../models/padrino.model';
import { DressCode } from '../../../models/dress-code.model';
import { Historia } from '../../../models/historia.model';
import { Hospedaje } from '../../../models/hospedaje.model';
import { Galeria } from '../../../models/galeria.model';
import { Contador } from '../../../models/contador.model';
import { Regalos } from '../../../models/regalos.model';
import { Consideraciones } from '../../../models/consideraciones.model';
import { Confirmacion } from '../../../models/confirmacion.model';
import { AudioPlayerComponent } from './shared/audio-player/audio-player.component';
import * as AOS from 'aos';

@Component({
  selector: 'app-invitacion-generica',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    NosCasamosSectionComponent,
    InvitacionValidaSectionComponent,
    CeremoniaSectionComponent,
    PadresSectionComponent,
    PadrinosSectionComponent,
    DamasSectionComponent,
    DresscodeSectionComponent,
    HistoriaSectionComponent,
    ItinerarioSectionComponent,
    HashtagSectionComponent,
    ContadorSectionComponent,
    RegalosSectionComponent,
    ConsideracionesSectionComponent,
    ConfirmacionSectionComponent,
    FooterSectionComponent,
    GaleriaSectionComponent,
    HospedajeSectionComponent,
    AudioPlayerComponent, // ✅ YA ESTÁ
  ],
  templateUrl: './invitacion-generica.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./invitacion-generica.component.css'],
})
export class InvitacionGenericaComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() data!: Invitacion;

  constructor() {}

  ngOnInit() {}

  // ✅ MÉTODO PARA INICIALIZAR AOS
  ngAfterViewInit() {
    this.inicializarAOS();
  }

  // ✅ MÉTODO PARA REACCIONAR A CAMBIOS EN data
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.inicializarAOS();
    }
  }

  // ✅ MÉTODO PARA CONTROLAR AOS
  private inicializarAOS() {
    // ✅ Verificar si las animaciones están activadas
    const animacionesActivadas = this.data?.animacionesAOS !== false;

    if (animacionesActivadas) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        offset: 80,
        delay: 100,
        mirror: true,
      });

      setTimeout(() => {
        AOS.refresh();
        console.log('🎬 Animaciones AOS activadas');
      }, 200);
    } else {
      this.desactivarAOS();
      console.log('🎬 Animaciones AOS desactivadas');
    }
  }

  // ✅ MÉTODO PARA DESACTIVAR AOS
  private desactivarAOS() {
    document.querySelectorAll('[data-aos]').forEach((el) => {
      el.removeAttribute('data-aos');
      el.removeAttribute('data-aos-duration');
      el.removeAttribute('data-aos-delay');
      el.removeAttribute('data-aos-once');
    });
    AOS.refresh();
  }

  get fechaFormateada(): string {
    if (!this.data?.fecha) return '';
    const fecha =
      this.data.fecha instanceof Date
        ? this.data.fecha
        : new Date(this.data.fecha as any);

    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get padrinosFormateados(): PadrinoAsignado[] {
    if (!this.data?.padrinos || this.data.padrinos.length === 0) {
      return [];
    }

    const primerElemento = this.data.padrinos[0];

    if (typeof primerElemento === 'string') {
      const resultado = (this.data.padrinos as string[]).map(
        (nombre: string) => ({
          nombre: nombre,
          rol: 'personalizado',
          observaciones: '',
        }),
      );
      return resultado;
    }

    if (
      typeof primerElemento === 'object' &&
      primerElemento !== null &&
      'nombre' in primerElemento
    ) {
      const resultado = this.data.padrinos as unknown as PadrinoAsignado[];
      return resultado;
    }

    return [];
  }

  get dressCodeFormateado(): DressCode {
    const dc = this.data?.dressCode || {};
    const resultado = {
      estilo: dc.estilo || '',
      colores: dc.colores || [],
      coloresReservados: dc.coloresReservados || [],
      titulo: dc.titulo || 'Código de Vestimenta',
      descripcion: dc.descripcion || '',
      sugerencia: dc.sugerencia || '',
      notaAdicional: dc.notaAdicional || '',
      fontFamily: this.data?.fontFamily || "'Playfair Display', Georgia, serif",
    };
    return resultado;
  }

  get historiaFormateada(): Historia {
    const h = this.data?.historia || {};
    return {
      mostrarSeccion: (h as any).mostrarSeccion ?? true,
      estilo: (h as any).estilo || 'timeline',
      titulo: (h as any).titulo || 'Nuestra Historia',
      descripcion: (h as any).descripcion || '',
      momentos: (h as any).momentos || [],
      fontFamily: this.data?.fontFamily || "'Playfair Display', Georgia, serif",
    };
  }

  get hospedajeFormateado(): Hospedaje {
    const h = this.data?.hospedaje || {};
    return {
      mostrarSeccion: (h as any).mostrarSeccion ?? true,
      estilo: (h as any).estilo || 'tarjetas',
      titulo: (h as any).titulo || 'Hospedaje Airbnb',
      descripcion: (h as any).descripcion || '',
      alojamientos: (h as any).alojamientos || [],
      textoBoton: (h as any).textoBoton || 'Ver en Airbnb',
      textoAdicional: (h as any).textoAdicional || '',
    };
  }

  get galeriaFormateada(): Galeria {
    const g = this.data?.galeria || {};
    return {
      mostrarSeccion: (g as any).mostrarSeccion ?? true,
      titulo: (g as any).titulo || 'Nuestros Momentos',
      subtitulo: (g as any).subtitulo || '',
      descripcion: (g as any).descripcion || '',
      fotos: (g as any).fotos || [],
      estilo: (g as any).estilo || 'grid',
      efecto: (g as any).efecto || 'slide',
      velocidad: (g as any).velocidad || 1000,
      mostrarControles: (g as any).mostrarControles ?? true,
      mostrarCompartir: (g as any).mostrarCompartir ?? true,
      mostrarPaginacion: (g as any).mostrarPaginacion ?? true,
    };
  }

  get defaultContador(): Contador {
    return {
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
  }

  get contadorFormateado(): Contador {
    const c = this.data?.contador || {};

    let contadorData = c;
    if (typeof c === 'string') {
      try {
        contadorData = JSON.parse(c);
      } catch (e) {
        contadorData = {};
      }
    }

    const fechaEvento =
      (contadorData as any).fechaEvento ||
      (contadorData as any).fechaObjetivo ||
      '';

    const colores = (contadorData as any).colores || {};
    const etiquetas = (contadorData as any).etiquetas || {};

    return {
      mostrarSeccion: (contadorData as any).mostrarSeccion ?? true,
      fechaEvento: fechaEvento,
      estilo: (contadorData as any).estilo || 'clasico',
      titulo: (contadorData as any).titulo || 'Faltan para nuestro gran día',
      mensaje:
        (contadorData as any).mensaje ||
        '¡No podemos esperar para celebrar contigo!',
      colorPrincipal: (contadorData as any).colorPrincipal || '#c9a87c',
      colores: {
        dias: colores.dias || '#5c3d2e',
        horas: colores.horas || '#8b6b4a',
        minutos: colores.minutos || '#c9a87c',
        segundos: colores.segundos || '#e8d5c0',
      },
      etiquetas: {
        dias: etiquetas.dias || 'DÍAS',
        horas: etiquetas.horas || 'HORAS',
        minutos: etiquetas.minutos || 'MINUTOS',
        segundos: etiquetas.segundos || 'SEGUNDOS',
      },
    };
  }

  get regalosFormateado(): Regalos {
    const r = this.data?.regalos || {};

    if (r && 'texto' in r && 'links' in r) {
      const antiguo = r as any;
      const opciones =
        antiguo.links?.map((link: any) => ({
          nombre: link.nombre || '',
          subtitulo: '',
          icono: '🎁',
          url: link.url || '',
        })) || [];

      return {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Mesa de Regalos',
        descripcion:
          antiguo.texto ||
          'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, encontrarás nuestras opciones aquí.',
        opciones: opciones,
        textoBoton: 'Ver mesa de regalos',
      };
    }

    return {
      mostrarSeccion: (r as any).mostrarSeccion ?? true,
      estilo: (r as any).estilo || 'tarjetas',
      titulo: (r as any).titulo || 'Mesa de Regalos',
      descripcion:
        (r as any).descripcion ||
        'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, encontrarás nuestras opciones aquí.',
      opciones: (r as any).opciones || [],
      textoBoton: (r as any).textoBoton || 'Ver mesa de regalos',
    };
  }

  get consideracionesFormateado(): Consideraciones {
    const c = this.data?.consideracionesData;

    if (c && (c as any).items && (c as any).items.length > 0) {
      return {
        mostrarSeccion: (c as any).mostrarSeccion ?? true,
        estilo: (c as any).estilo || 'iconos',
        titulo: (c as any).titulo || 'Consideraciones',
        subtitulo: (c as any).subtitulo || 'Para que todo salga perfecto',
        mensajeIntro:
          (c as any).mensajeIntro ||
          'Gracias por ser parte de este momento tan especial. Te compartimos algunas recomendaciones importantes.',
        colorIconos: (c as any).colorIconos || '#c9a87c',
        items: (c as any).items || [],
      };
    }

    const antiguo = (this.data as any)?.consideraciones;

    if (typeof antiguo === 'string' && antiguo.trim() !== '') {
      return {
        mostrarSeccion: true,
        estilo: 'iconos',
        titulo: 'Consideraciones',
        subtitulo: 'Para que todo salga perfecto',
        mensajeIntro: 'Gracias por ser parte de este momento tan especial.',
        colorIconos: '#c9a87c',
        items: [
          { titulo: 'Consideraciones', descripcion: antiguo, icono: '📌' },
        ],
      };
    }

    return {
      mostrarSeccion: true,
      estilo: 'iconos',
      titulo: 'Consideraciones',
      subtitulo: 'Para que todo salga perfecto',
      mensajeIntro:
        'Gracias por ser parte de este momento tan especial. Te compartimos algunas recomendaciones importantes.',
      colorIconos: '#c9a87c',
      items: [],
    };
  }

  get confirmacionFormateado(): Confirmacion {
    const c = this.data?.confirmacionData || {};
    return {
      mostrarSeccion: (c as any).mostrarSeccion ?? true,
      estilo: (c as any).estilo || 'tarjetas',
      titulo: (c as any).titulo || 'Confirma tu asistencia',
      descripcion:
        (c as any).descripcion ||
        'Nos encantaría compartir este momento contigo. Por favor confirma tu asistencia.',
      mostrarConfirmar: (c as any).mostrarConfirmar ?? true,
      mostrarRechazar: (c as any).mostrarRechazar ?? true,
      mostrarCalendario: (c as any).mostrarCalendario ?? true,
    };
  }

  // ✅ Configuración de AOS
  // ✅ CORREGIDO - Usar notación de corchetes
  public getAOSConfig(estilo?: string) {
    const configs: Record<string, any> = {
      clasico: {
        default: 'fade-up',
        galeria: 'zoom-in',
        laterales: 'fade-right',
        duracion: 800,
        delay: 100,
        easing: 'ease-in-out',
      },
      moderno: {
        default: 'fade-down',
        galeria: 'zoom-out',
        laterales: 'zoom-in-left',
        duracion: 700,
        delay: 80,
        easing: 'ease-out',
      },
      romantico: {
        default: 'fade-right',
        galeria: 'zoom-in',
        laterales: 'fade-left',
        duracion: 900,
        delay: 120,
        easing: 'ease-in-out',
      },
      minimalista: {
        default: 'fade',
        galeria: 'fade',
        laterales: 'fade',
        duracion: 500,
        delay: 50,
        easing: 'linear',
      },
      dinamico: {
        default: 'zoom-in-up',
        galeria: 'zoom-in',
        laterales: 'fade-right',
        duracion: 800,
        delay: 100,
        easing: 'ease-in-out',
      },
    };

    // ✅ Usar corchetes en lugar de punto
    return configs[estilo || 'clasico'] || configs['clasico'];
  }

  // ✅ Animación por sección
  public getAOSAnimation(seccion: string, estilo: string): string {
    const config = this.getAOSConfig(estilo);
    const animaciones: Record<string, string> = {
      'nos-casamos': config.default,
      contador: config.default,
      ceremonia: config.default,
      // ... todas las secciones
    };
    return animaciones[seccion] || config.default;
  }

  // ✅ Delay por sección (efecto cascada)
  public getAOSDelay(seccion: string): string {
    const delays: Record<string, string> = {
      'nos-casamos': '0',
      contador: '100',
      ceremonia: '200',
      // ... todas las secciones
    };
    return delays[seccion] || '100';
  }
}
