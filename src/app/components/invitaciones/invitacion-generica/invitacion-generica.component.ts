import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invitacion } from '../../../services/invitaciones.service';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { NosCasamosSectionComponent } from './sections/nos-casamos-section/nos-casamos-section.component';
import { InvitacionValidaSectionComponent } from './sections/invitacion-valida-section/invitacion-valida-section.component';
import { CeremoniaSectionComponent } from './sections/ceremonia-section/ceremonia-section.component';
// Importa los demás componentes que crearás
import { PadresSectionComponent } from './sections/padres-section/padres-section.component';
import { RecepcionSectionComponent } from './sections/recepcion-section/recepcion-section.component';
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
    RecepcionSectionComponent,
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
  ],
  templateUrl: './invitacion-generica.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./invitacion-generica.component.css'],
})
export class InvitacionGenericaComponent implements OnInit {
  @Input() data!: Invitacion;
  constructor() {}

  ngOnInit() {
    console.log('DATOS COMPLETOS:', this.data);
    console.log('Ceremonia:', this.data?.ceremonia);
    console.log('Recepcion:', this.data?.recepcion);
    console.log('Padrinos:', this.data?.padrinos);
    console.log('DressCode:', this.data?.dressCode);
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

  // 👇 AGREGAR ESTE GETTER
  get padrinosFormateados(): PadrinoAsignado[] {
    console.log('🔍 EJECUTANDO GETTER padrinosFormateados');
    console.log('🔍 data:', this.data);
    console.log('🔍 data.padrinos:', this.data?.padrinos);
    console.log('🔍 tipo de data.padrinos:', typeof this.data?.padrinos);
    console.log('🔍 es array?', Array.isArray(this.data?.padrinos));
    console.log('🔍 longitud:', this.data?.padrinos?.length);

    if (!this.data?.padrinos || this.data.padrinos.length === 0) {
      console.log('⚠️ No hay padrinos');
      return [];
    }

    const primerElemento = this.data.padrinos[0];
    console.log('🔍 Primer elemento:', primerElemento);
    console.log('🔍 Tipo del primer elemento:', typeof primerElemento);
    console.log('🔍 ¿Es string?', typeof primerElemento === 'string');
    console.log(
      '🔍 ¿Es objeto con nombre?',
      typeof primerElemento === 'object' &&
        primerElemento !== null &&
        'nombre' in primerElemento,
    );

    // Si es string, convertir a objeto PadrinoAsignado
    if (typeof primerElemento === 'string') {
      console.log('🔄 Convirtiendo strings a objetos');
      const resultado = (this.data.padrinos as string[]).map(
        (nombre: string) => ({
          nombre: nombre,
          rol: 'personalizado',
          observaciones: '',
        }),
      );
      console.log('✅ Padrinos convertidos:', resultado);
      return resultado;
    }

    // Si ya es objeto con 'nombre', devolverlo
    if (
      typeof primerElemento === 'object' &&
      primerElemento !== null &&
      'nombre' in primerElemento
    ) {
      console.log('✅ Ya son objetos PadrinoAsignado');
      const resultado = this.data.padrinos as unknown as PadrinoAsignado[];
      console.log('📊 Padrinos:', resultado);
      return resultado;
    }

    console.log('⚠️ Formato desconocido');
    return [];
  }

  // invitacion-generica.component.ts

  get dressCodeFormateado(): DressCode {
    console.log('🎯 Ejecutando dressCodeFormateado');
    console.log('📦 data.dressCode:', this.data?.dressCode);

    const dc = this.data?.dressCode || {};
    const resultado = {
      estilo: dc.estilo || '',
      colores: dc.colores || [],
      coloresReservados: dc.coloresReservados || [],
      titulo: dc.titulo || 'Código de Vestimenta',
      descripcion: dc.descripcion || '',
      sugerencia: dc.sugerencia || '',
      notaAdicional: dc.notaAdicional || '',
    };

    console.log('✅ dressCodeFormateado:', resultado);
    return resultado;
  }

  // invitacion-generica.component.ts

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

  // invitacion-generica.component.ts

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
      subtitulo: (g as any).subtitulo || '', // 👈 AGREGAR
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

    console.log('📊 Contador raw:', c);

    // Si viene como string, convertirlo (por si acaso)
    let contadorData = c;
    if (typeof c === 'string') {
      try {
        contadorData = JSON.parse(c);
      } catch (e) {
        console.error('Error parsing contador:', e);
        contadorData = {};
      }
    }

    // Mapear fechaObjetivo a fechaEvento si existe
    const fechaEvento =
      (contadorData as any).fechaEvento ||
      (contadorData as any).fechaObjetivo ||
      '';

    // Asegurar que colores y etiquetas tengan estructura correcta
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
  /**
   * Getter que formatea los datos de regalos al nuevo formato
   * Migra automáticamente desde el formato antiguo si es necesario
   */
  get regalosFormateado(): Regalos {
    const r = this.data?.regalos || {};

    // Si es el formato antiguo (tiene 'texto' y 'links'), migrar datos
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

    // Si ya es el nuevo formato o no existe, devolverlo con valores por defecto
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
    // 👇 LOG PARA VER QUÉ LLEGA
    console.log('🔍 DATA COMPLETA en invitación:', this.data);
    console.log('🔍 consideracionesData:', this.data?.consideracionesData);
    console.log(
      '🔍 consideraciones (antiguo):',
      (this.data as any)?.consideraciones,
    );

    // ✅ PRIMERO: Buscar en consideracionesData (formato nuevo)
    const c = this.data?.consideracionesData;

    // Si existe consideracionesData y tiene items, usarlo
    if (c && (c as any).items && (c as any).items.length > 0) {
      console.log('✅ Usando consideracionesData con items:', (c as any).items);
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

    // Si consideracionesData no tiene items, buscar en consideraciones (formato antiguo)
    const antiguo = (this.data as any)?.consideraciones;

    // Si es string y no está vacío, convertirlo a items
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

    // Si no hay datos, devolver valores por defecto

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
  // Getter que devuelve la fuente del data
}
