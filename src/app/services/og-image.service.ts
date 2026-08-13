// src/app/services/og-image.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OgImageService {
  constructor() {}

  /**
   * Genera una URL de imagen optimizada para WhatsApp usando Cloudinary
   * @param evento - Objeto del evento con las imágenes
   * @param invitado - Nombre del invitado
   * @returns URL de la imagen generada
   */
  generateImage(evento: any, invitado: string): string {
    // 📱 Detectar si es móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 🖼️ Elegir la imagen según el dispositivo
    let imagenUrl = '';
    if (isMobile && evento.heroImageMovil) {
      imagenUrl = evento.heroImageMovil;
    } else if (evento.heroImageEscritorio) {
      imagenUrl = evento.heroImageEscritorio;
    } else if (evento.heroImage) {
      imagenUrl = evento.heroImage;
    }

    // ✅ Si no hay imagen, usar una por defecto
    if (!imagenUrl) {
      console.warn('⚠️ No se encontró imagen para el evento');
      return 'assets/default-share.jpg';
    }

    // ✅ Transformación de Cloudinary para WhatsApp
    if (imagenUrl.includes('cloudinary.com')) {
      const parts = imagenUrl.split('/upload/');
      if (parts.length === 2) {
        // 📝 Textos para overlay
        const titulo = encodeURIComponent(`✨ ${evento.name || 'Invitación'}`);
        const nombre = encodeURIComponent(invitado);

        // 🎨 Generar imagen con texto overlay
        return `${parts[0]}/upload/f_auto,q_auto,w_1200,h_630,c_fill,l_text:Arial_60:${titulo},co_rgb:ffffff,g_center,l_text:Arial_40:${nombre},co_rgb:ffd700,g_south,o_90/${parts[1]}`;
      }
    }

    // ✅ Si no es Cloudinary, devolver la URL original
    return imagenUrl;
  }

  /**
   * Genera una versión simple de la imagen (sin overlay)
   * @param evento - Objeto del evento con las imágenes
   * @returns URL de la imagen transformada
   */
  generateSimpleImage(evento: any): string {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let imagenUrl = '';
    if (isMobile && evento.heroImageMovil) {
      imagenUrl = evento.heroImageMovil;
    } else if (evento.heroImageEscritorio) {
      imagenUrl = evento.heroImageEscritorio;
    } else if (evento.heroImage) {
      imagenUrl = evento.heroImage;
    }

    if (!imagenUrl) {
      return 'assets/default-share.jpg';
    }

    if (imagenUrl.includes('cloudinary.com')) {
      const parts = imagenUrl.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto,w_1200,h_630,c_fill/${parts[1]}`;
      }
    }

    return imagenUrl;
  }

  /**
   * Obtiene la URL de la imagen del evento (sin transformación)
   * @param evento - Objeto del evento con las imágenes
   * @returns URL de la imagen original
   */
  getOriginalImage(evento: any): string {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && evento.heroImageMovil) {
      return evento.heroImageMovil;
    } else if (evento.heroImageEscritorio) {
      return evento.heroImageEscritorio;
    } else if (evento.heroImage) {
      return evento.heroImage;
    }

    return 'assets/default-share.jpg';
  }
}
