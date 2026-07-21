import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Pagination, EffectCreative, Autoplay } from 'swiper/modules';
import {
  PadrinoAsignado,
  ROLES_PADrinos,
  TipoRolPadrino,
} from '../../../../../models/padrino.model';

@Component({
  selector: 'app-padrinos-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './padrinos-section.component.html',
  styleUrls: ['./padrinos-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PadrinosSectionComponent implements AfterViewInit, OnDestroy {
  // 👇 CAMBIAR DE string[] a PadrinoAsignado[]
  @Input() data: PadrinoAsignado[] = [];
  @Input() titulo: string = 'Nuestros Padrinos';

  private swiperInstance: any;

  constructor(private el: ElementRef) {}

  // 👇 GETTER: Agrupar padrinos por rol
  get padrinosAgrupados(): {
    rol: string;
    nombres: string[];
    icon: string;
    description: string;
  }[] {
    if (!this.data || this.data.length === 0) {
      return [];
    }

    const grupos = this.data.reduce(
      (acc, padrino) => {
        if (!padrino || !padrino.nombre) {
          return acc;
        }

        const rolId = padrino.rol || 'personalizado';
        const rolInfo = ROLES_PADrinos[rolId as TipoRolPadrino];

        if (!acc[rolId]) {
          acc[rolId] = {
            nombres: [],
            icon: rolInfo?.icon || '⭐',
            nombreRol: rolInfo?.nombre || rolId,
            descripcion: rolInfo?.descripcion || 'Rol personalizado',
          };
        }
        acc[rolId].nombres.push(padrino.nombre);
        return acc;
      },
      {} as {
        [key: string]: {
          nombres: string[];
          icon: string;
          nombreRol: string;
          descripcion: string;
        };
      },
    );

    return Object.entries(grupos).map(([rolId, data]) => ({
      rol: data.nombreRol,
      nombres: data.nombres,
      icon: data.icon,
      description: data.descripcion,
    }));
  }

  // 👇 GETTER: Verificar si hay padrinos
  get tienePadrinos(): boolean {
    return this.data && this.data.length > 0;
  }

  // padrinos-section.component.ts

  ngAfterViewInit(): void {
    console.log('📊 Padrinos recibidos en componente:', this.data);
    console.log('📊 Tipo de data:', typeof this.data);
    console.log('📊 Es array?', Array.isArray(this.data));
    console.log('📊 Longitud:', this.data?.length);
    console.log('📊 Primer elemento:', this.data?.[0]);

    if (this.tienePadrinos) {
      console.log('✅ Hay padrinos, inicializando Swiper...');
      setTimeout(() => this.inicializarSwiper(), 100);
    } else {
      console.log('⚠️ No hay padrinos en el componente');
    }
  }

  ngOnDestroy(): void {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }

  inicializarSwiper(): void {
    Swiper.use([Pagination, EffectCreative, Autoplay]);

    const efectoSeleccionado: number = 1;

    let creativeEffect: any;

    switch (efectoSeleccionado) {
      case 1:
        creativeEffect = {
          prev: { shadow: false, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        };
        break;
      case 2:
        creativeEffect = {
          prev: { shadow: false, translate: ['-120%', 0, -500] },
          next: { shadow: false, translate: ['120%', 0, -500] },
        };
        break;
      case 3:
        creativeEffect = {
          prev: { shadow: false, translate: ['-20%', 0, -1] },
          next: { translate: ['100%', 0, 0] },
        };
        break;
      case 4:
        creativeEffect = {
          prev: { shadow: false, translate: [0, 0, -800], rotate: [180, 0, 0] },
          next: {
            shadow: false,
            translate: [0, 0, -800],
            rotate: [-180, 0, 0],
          },
        };
        break;
      case 5:
        creativeEffect = {
          prev: {
            shadow: false,
            translate: ['-125%', 0, -800],
            rotate: [0, 0, -90],
          },
          next: {
            shadow: false,
            translate: ['125%', 0, -800],
            rotate: [0, 0, 90],
          },
        };
        break;
      case 6:
        creativeEffect = {
          prev: {
            shadow: false,
            origin: 'left center',
            translate: ['-5%', 0, -200],
            rotate: [0, 100, 0],
          },
          next: {
            origin: 'right center',
            translate: ['5%', 0, -200],
            rotate: [0, -100, 0],
          },
        };
        break;
      default:
        creativeEffect = {
          prev: { shadow: false, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        };
    }

    const progressCircle = document.querySelector('.autoplay-progress svg');
    const progressContent = document.querySelector('.autoplay-progress span');

    this.swiperInstance = new Swiper('.padrinos-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      effect: 'creative',
      creativeEffect: creativeEffect,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index: number, className: string) {
          return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
      },
      on: {
        autoplayTimeLeft(s: any, time: number, progress: number) {
          // ✅ Asegurar que progress esté entre 0 y 1
          const normalizedProgress = Math.max(0, Math.min(1, progress));

          if (progressCircle) {
            (progressCircle as HTMLElement).style.setProperty(
              '--progress',
              String(1 - normalizedProgress),
            );
          }
          if (progressContent) {
            // ✅ Asegurar que el tiempo no sea negativo
            const seconds = Math.ceil(Math.max(0, time / 1000));
            progressContent.textContent = `${seconds}s`;
          }
        },
      },
      breakpoints: {
        480: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },
    });
  }
}
