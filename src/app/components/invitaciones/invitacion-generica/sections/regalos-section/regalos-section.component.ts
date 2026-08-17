// src/app/components/invitaciones/invitacion-generica/sections/regalos-section/regalos-section.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { Regalos } from '../../../../../models/regalos.model';

@Component({
  selector: 'app-regalos-section',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './regalos-section.component.html',
  styleUrls: ['./regalos-section.component.css'],
})
export class RegalosSectionComponent {
  @Input() data!: Regalos;
  @Input() fontFamily: string = "'Playfair Display', Georgia, serif";

  /**
   * ✅ Copia el número de cuenta al portapapeles
   * @param cuenta - Número de cuenta o CLABE
   * @param event - Evento del click
   */
  copiarCuenta(cuenta: string, event: Event) {
    event.stopPropagation();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(cuenta)
        .then(() => {
          this.mostrarNotificacion('✅ ¡Cuenta copiada!');
        })
        .catch(() => {
          this.copiarCuentaFallback(cuenta);
        });
    } else {
      this.copiarCuentaFallback(cuenta);
    }
  }

  /**
   * ✅ Método alternativo para copiar (fallback para navegadores antiguos)
   * @param cuenta - Número de cuenta o CLABE
   */
  private copiarCuentaFallback(cuenta: string) {
    const textarea = document.createElement('textarea');
    textarea.value = cuenta;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      this.mostrarNotificacion('✅ ¡Cuenta copiada!');
    } catch (err) {
      this.mostrarNotificacion(
        '❌ No se pudo copiar. Copia manualmente: ' + cuenta,
      );
    }

    document.body.removeChild(textarea);
  }

  /**
   * ✅ Muestra una notificación temporal
   * @param mensaje - Mensaje a mostrar
   */
  private mostrarNotificacion(mensaje: string) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px 24px;
      border-radius: 40px;
      font-size: 0.9rem;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      transition: opacity 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      max-width: 90%;
      text-align: center;
    `;
    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notificacion);
      }, 300);
    }, 2000);
  }
}
