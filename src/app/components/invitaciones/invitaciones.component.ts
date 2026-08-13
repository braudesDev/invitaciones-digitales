import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { Observable, of, firstValueFrom } from 'rxjs';
import {
  InvitacionesService,
  Invitacion,
} from '../../services/invitaciones.service';
import { InvitadosService } from '../../services/invitados.service';
import { InvitacionGenericaComponent } from './invitacion-generica/invitacion-generica.component';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-invitaciones',
  standalone: true,
  imports: [CommonModule, InvitacionGenericaComponent, NgIcon],
  templateUrl: './invitaciones.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./invitaciones.component.css'],
})
export class InvitacionesComponent implements OnInit {
  invitacion$?: Observable<Invitacion | undefined>;
  cargando = true;

  // ✅ URL del logo de ON/OFFSHOT (fallback)
  private readonly LOGO_ONOFFSHOT =
    'https://res.cloudinary.com/drsyb53ae/image/upload/v1744682880/logotiposPortafolioFotografico/v7voslzcc1uz9f7tmpqg.png';

  constructor(
    private route: ActivatedRoute,
    private invitacionesService: InvitacionesService,
    private invitadosService: InvitadosService,
    private meta: Meta,
    private title: Title,
    private firestore: Firestore,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.cargando = false;
      return;
    }

    try {
      const invitadoData = await firstValueFrom(
        this.invitadosService.getInvitadoPorSlug(slug),
      );

      if (!invitadoData) {
        this.cargando = false;
        return;
      }

      const eventoRef = collection(this.firestore, 'invitaciones');
      const eventoQuery = query(
        eventoRef,
        where('slug', '==', invitadoData.eventoSlug),
      );

      const docs = await firstValueFrom(
        collectionData<any>(eventoQuery, { idField: 'id' }),
      );

      const eventoDoc = docs[0];
      if (!eventoDoc) {
        this.cargando = false;
        return;
      }

      const invitacionCompleta: Invitacion = {
        ...eventoDoc,
        id: eventoDoc.id ?? '',
        fecha: eventoDoc.fecha ? new Date(eventoDoc.fecha) : new Date(),
        invitado: invitadoData.nombre,
        pases: invitadoData.pases,
        mensajePersonalizado: invitadoData.mensajePersonalizado,
        heroImage: eventoDoc.heroImage || '',
        heroImageMovil: eventoDoc.heroImageMovil || '',
        heroImageEscritorio: eventoDoc.heroImageEscritorio || '',
      };

      // ✅ CONFIGURAR METADATOS
      this.setMetaTags(invitacionCompleta, invitadoData.nombre);

      this.invitacion$ = of(invitacionCompleta);
      this.cargando = false;
    } catch (error) {
      console.error('❌ Error al cargar la invitación:', error);
      this.cargando = false;
    }
  }

  /**
   * 🖼️ Obtiene la imagen para compartir (Hero o logo)
   * Prioriza: heroImageMovil > heroImageEscritorio > heroImage > logo ON/OFFSHOT
   */
  private getImagenParaCompartir(inv: Invitacion): string {
    // 📱 Detectar si es móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 🖼️ 1. Intentar obtener la imagen del Hero
    let imagenUrl = '';
    if (isMobile && inv.heroImageMovil) {
      imagenUrl = inv.heroImageMovil;
    } else if (inv.heroImageEscritorio) {
      imagenUrl = inv.heroImageEscritorio;
    } else if (inv.heroImage) {
      imagenUrl = inv.heroImage;
    }

    // ✅ 2. Si NO hay imagen del Hero, usar el logo de ON/OFFSHOT
    if (!imagenUrl) {
      console.log('🖼️ Usando logo ON/OFFSHOT (no hay imagen del Hero)');
      return this.LOGO_ONOFFSHOT;
    }

    console.log('🖼️ Usando imagen del Hero:', imagenUrl);

    // ✅ 3. Si es Cloudinary, optimizar para WhatsApp
    if (imagenUrl.includes('cloudinary.com')) {
      const separator = imagenUrl.includes('?') ? '&' : '?';
      return `${imagenUrl}${separator}f_auto,q_auto,w_1200,h_630,c_fill`;
    }

    return imagenUrl;
  }

  /**
   * 📋 Configura los metadatos Open Graph para WhatsApp y redes sociales
   */
  private setMetaTags(inv: Invitacion, nombreInvitado?: string) {
    const imagenParaCompartir = this.getImagenParaCompartir(inv);

    console.log('🖼️ Imagen final para compartir:', imagenParaCompartir);

    // 📝 Título y descripción
    const titulo = nombreInvitado
      ? `${inv.name} - Invitación para ${nombreInvitado}`
      : `${inv.name} | On Off Shot Invitaciones`;

    const descripcion = nombreInvitado
      ? `${nombreInvitado}, te esperamos en ${inv.name}. ¡Confirma tu asistencia!`
      : `Te invitamos a ${inv.name}. ¡Haz clic para ver los detalles!`;

    // ✅ 1. Usar Angular Meta service
    this.title.setTitle(titulo);

    this.meta.updateTag({ property: 'og:title', content: titulo });
    this.meta.updateTag({ property: 'og:description', content: descripcion });
    this.meta.updateTag({ property: 'og:image', content: imagenParaCompartir });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({
      property: 'og:site_name',
      content: 'On Off Shot Invitaciones',
    });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Twitter Cards
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: titulo });
    this.meta.updateTag({ name: 'twitter:description', content: descripcion });
    this.meta.updateTag({
      name: 'twitter:image',
      content: imagenParaCompartir,
    });

    // ✅ 2. Usar Renderer2 para asegurar que los metadatos estén en el head
    const head = this.document.head;

    // Limpiar meta tags existentes (evitar duplicados)
    const existingMeta = head.querySelectorAll(
      'meta[property^="og:"], meta[name^="twitter:"]',
    );
    existingMeta.forEach((el) => el.remove());

    // Crear meta tags con Renderer2
    const metaTags = [
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: imagenParaCompartir },
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'On Off Shot Invitaciones' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ];

    metaTags.forEach((tag) => {
      const meta = this.renderer.createElement('meta');
      this.renderer.setAttribute(meta, 'property', tag.property);
      this.renderer.setAttribute(meta, 'content', tag.content);
      this.renderer.appendChild(head, meta);
    });

    // Twitter Cards con Renderer2
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: imagenParaCompartir },
    ];

    twitterTags.forEach((tag) => {
      const meta = this.renderer.createElement('meta');
      this.renderer.setAttribute(meta, 'name', tag.name);
      this.renderer.setAttribute(meta, 'content', tag.content);
      this.renderer.appendChild(head, meta);
    });

    console.log('✅ Metadatos Open Graph configurados correctamente');
    console.log('📋 Título:', titulo);
    console.log('📋 Descripción:', descripcion);
    console.log('🖼️ Imagen:', imagenParaCompartir);
  }
}
