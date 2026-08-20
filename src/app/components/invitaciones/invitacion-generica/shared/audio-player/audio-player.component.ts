import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { AudioConfig } from '../../../../../models/audio.model';
import { HexToRgbPipe } from '../../../../../pipes/hex-to-rgb-pipe'; // ✅ IMPORTAR

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, NgIcon, HexToRgbPipe],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css'],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() audioConfig?: AudioConfig;
  @Input() primaryColor: string = '#5c3d2e';
  @Input() accentColor: string = '#c9a87c';
  @Input() textColor: string = '#ffffff';

  private audio: HTMLAudioElement | null = null;
  private cancionActual: number = 0;

  isPlaying: boolean = false;
  isMuted: boolean = false;
  volumen: number = 0.7;
  visible: boolean = false;

  ngOnInit() {
    if (
      this.audioConfig?.habilitado &&
      this.audioConfig?.canciones?.length > 0
    ) {
      this.inicializarAudio();
    }
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }

  private inicializarAudio() {
    const url = this.audioConfig?.canciones[0]?.url;
    if (!url) return;

    this.audio = new Audio(url);
    this.audio.volume = this.volumen;
    this.audio.loop = false; // Lo manejamos manualmente

    // ✅ Cuando termina una canción, pasa a la siguiente
    this.audio.addEventListener('ended', () => {
      this.siguienteCancion();
    });

    // ✅ Mostrar el reproductor después de un momento
    setTimeout(() => {
      this.visible = true;
    }, 1000);

    // ✅ Si autoplay está activado
    if (this.audioConfig?.autoPlay) {
      this.reproducir();
    }
  }

  private siguienteCancion() {
    if (!this.audioConfig?.canciones) return;

    const total = this.audioConfig.canciones.length;
    this.cancionActual = (this.cancionActual + 1) % total;

    const cancion = this.audioConfig.canciones[this.cancionActual];
    if (this.audio && cancion) {
      this.audio.src = cancion.url;
      this.audio.play();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pausar();
    } else {
      this.reproducir();
    }
  }

  reproducir() {
    if (this.audio) {
      this.audio.play().catch(() => {
        // El navegador puede bloquear el autoplay
        console.warn('No se pudo reproducir automáticamente');
      });
      this.isPlaying = true;
    }
  }

  pausar() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.muted = this.isMuted;
    }
  }

  cambiarVolumen(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volumen = parseFloat(input.value);
    if (this.audio) {
      this.audio.volume = this.volumen;
    }
    if (this.isMuted && this.volumen > 0) {
      this.isMuted = false;
      if (this.audio) {
        this.audio.muted = false;
      }
    }
  }
}
