import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/hero-section/hero-section.component';
import { NosCasamosSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/nos-casamos-section/nos-casamos-section.component';
import { InvitacionValidaSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/invitacion-valida-section/invitacion-valida-section.component';
import { CeremoniaSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/ceremonia-section/ceremonia-section.component';
import { RecepcionSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/recepcion-section/recepcion-section.component';
import { PadresSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/padres-section/padres-section.component';
import { PadrinosSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/padrinos-section/padrinos-section.component';
import { DamasSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/damas-section/damas-section.component';
import { DresscodeSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/dresscode-section/dresscode-section.component';
import { HistoriaSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/historia-section/historia-section.component';
import { GaleriaSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/galeria-section/galeria-section.component';
import { ItinerarioSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/itinerario-section/itinerario-section.component';
import { HospedajeSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/hospedaje-section/hospedaje-section.component';
import { HashtagSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/hashtag-section/hashtag-section.component';
import { ContadorSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/contador-section/contador-section.component';
import { RegalosSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/regalos-section/regalos-section.component';
import { ConsideracionesSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/consideraciones-section/consideraciones-section.component';
import { ConfirmacionSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/confirmacion-section/confirmacion-section.component';
import { FooterSectionComponent } from '../../components/invitaciones/invitacion-generica/sections/footer-section/footer-section.component';

@Component({
  selector: 'app-mi-boda',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    NosCasamosSectionComponent,
    InvitacionValidaSectionComponent,
    CeremoniaSectionComponent,
    RecepcionSectionComponent,
    PadresSectionComponent,
    PadrinosSectionComponent,
    DamasSectionComponent,
    DresscodeSectionComponent,
    HistoriaSectionComponent,
    GaleriaSectionComponent,
    ItinerarioSectionComponent,
    HospedajeSectionComponent,
    HashtagSectionComponent,
    ContadorSectionComponent,
    RegalosSectionComponent,
    ConsideracionesSectionComponent,
    ConfirmacionSectionComponent,
    FooterSectionComponent,
  ],
  templateUrl: './mi-boda.component.html',
  styleUrls: ['./mi-boda.component.css'],
})
export class MiBodaComponent implements OnInit {
  // SOLO DATOS - SIN COLORES (los estilos van en CSS)
  data: any = {
    // Datos principales
    nombres: 'Braulio y Ángeles',
    lugar: 'Jardín del Sol, Av. Principal #123, Ciudad',
    heroImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',

    // Frases
    frasePrincipal: '¡Nos Casamos!',
    mensajePrincipal:
      'Queremos compartir este día tan especial con ustedes. ¡Los esperamos!',

    // Historia
    historia:
      'Nos conocimos en el parque aquel día soleado... y desde entonces no nos hemos separado. Después de 5 años de amor, aventuras y sueños compartidos, hemos decidido dar el siguiente paso juntos.',

    // Invitación
    invitado: 'Invitado especial',
    pases: 1,
    mensajePersonalizado:
      'Te esperamos con mucha ilusión para celebrar juntos este día tan especial.',

    // Contador
    contador: {
      fecha: '2026-12-19T19:00:00',
      titulo: 'Faltan',
    },

    // Ceremonia
    ceremonia: {
      titulo: 'Ceremonia Religiosa',
      lugar: 'Parroquia de San José',
      direccion: 'Calle Principal #456, Ciudad',
      fecha: '19 de Diciembre, 2026',
      hora: '6:00 PM',
      mapaUrl: 'https://maps.google.com',
    },

    // Recepción
    recepcion: {
      titulo: 'Recepción',
      lugar: 'Jardín del Sol',
      direccion: 'Av. Principal #123, Ciudad',
      fecha: '19 de Diciembre, 2026',
      hora: '7:30 PM',
      mapaUrl: 'https://maps.google.com',
    },

    // Padres
    padres: {
      titulo: 'Con la bendición de nuestros padres',
      novio: 'Braulio',
      padresNovio: 'Sr. Juan y Sra. María',
      novia: 'Ángeles',
      padresNovia: 'Sr. Pedro y Sra. Ana',
    },

    // Padrinos
    padrinos: {
      titulo: 'Padrinos',
      lista: [
        { nombre: 'Padrino 1', rol: 'Bautizo' },
        { nombre: 'Padrina 1', rol: 'Bautizo' },
      ],
    },

    // Damas
    damas: {
      titulo: 'Damas de Honor',
      lista: ['Dama 1', 'Dama 2', 'Dama 3'],
    },

    // Dress Code
    dressCode: {
      titulo: 'Código de Vestimenta',
      descripcion:
        'Formal elegante. Colores sugeridos: tonos tierra, beige, y verde olivo.',
      sugerencias:
        'Caballeros: traje o terno. Damas: vestido largo o corto elegante.',
    },

    // Galería
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    ],

    // Itinerario
    itinerario: {
      titulo: 'Itinerario del Día',
      eventos: [
        { hora: '5:00 PM', descripcion: 'Llegada de invitados' },
        { hora: '6:00 PM', descripcion: 'Ceremonia religiosa' },
        { hora: '7:30 PM', descripcion: 'Recepción y brindis' },
        { hora: '9:00 PM', descripcion: 'Cena' },
        { hora: '11:00 PM', descripcion: 'Baile y celebración' },
      ],
    },

    // Hospedaje
    hospedaje: {
      titulo: 'Hospedaje',
      hoteles: [
        {
          nombre: 'Hotel Principal',
          direccion: 'Calle #123',
          telefono: '123-456-7890',
        },
      ],
    },

    // Hashtag
    hashtag: {
      titulo: 'Comparte tu experiencia',
      hashtag: '#BodaBraulioYAngeles',
      mensaje: '¡Comparte tus fotos con nuestro hashtag!',
    },

    // Regalos
    regalos: {
      titulo: 'Mesa de Regalos',
      mensaje:
        'Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo, aquí tienes nuestras sugerencias:',
      lista: ['Artículo 1', 'Artículo 2', 'Artículo 3'],
    },

    // Consideraciones
    consideraciones: {
      titulo: 'Consideraciones Importantes',
      lista: [
        'Confirmar asistencia antes del 1 de diciembre',
        'Niños: solo si vienen en la invitación',
        'Estacionamiento disponible en el lugar',
      ],
    },
  };

  get fechaFormateada(): string {
    return '19 de Diciembre, 2026';
  }

  ngOnInit() {
    console.log('Invitación de boda cargada');
  }
}
