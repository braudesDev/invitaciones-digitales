import { Component, OnInit, Input } from '@angular/core';
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
    HospedajeSectionComponent,
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
}
