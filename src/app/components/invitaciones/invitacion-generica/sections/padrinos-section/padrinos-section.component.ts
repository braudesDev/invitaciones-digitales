import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Pagination, EffectCreative } from 'swiper/modules';

@Component({
  selector: 'app-padrinos-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './padrinos-section.component.html',
  styleUrls: ['./padrinos-section.component.css'],
})
export class PadrinosSectionComponent implements AfterViewInit, OnDestroy {
  @Input() data: string[] = [];

  private swiperInstance: any;

  ngAfterViewInit(): void {
    if (this.data && this.data.length > 0) {
      setTimeout(() => this.inicializarSwiper(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }

  inicializarSwiper(): void {
    Swiper.use([Pagination, EffectCreative]);

    const totalPadrinos = this.data.length;

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

    this.swiperInstance = new Swiper('.padrinos-swiper', {
      slidesPerView: 1, //
      spaceBetween: 20,
      loop: false,
      grabCursor: true,
      effect: 'creative',
      creativeEffect: creativeEffect,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index: number, className: string) {
          return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
      },
      breakpoints: {
        480: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1, // 👈 En tablet también 1 para mantener el efecto
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 1, // 👈 En escritorio también 1 para mantener el efecto
          spaceBetween: 30,
        },
      },
    });
  }
}
