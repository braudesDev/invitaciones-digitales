import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { AudioConfig } from '../../../../../models/audio.model';
import { HexToRgbPipe } from '../../../../../pipes/hex-to-rgb-pipe';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, NgIcon, HexToRgbPipe],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css'],
})
export class AudioPlayerComponent implements OnInit, OnChanges, OnDestroy {
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

  // ✅ Escuchar cambios en audioConfig (ej: cuando Firestore se actualiza)
  ngOnChanges(changes: SimpleChanges) {
    if (changes['audioConfig']) {
      const newConfig = changes['audioConfig'].currentValue;
      console.log('🎵 AudioConfig actualizado:', newConfig);

      if (newConfig?.habilitado && newConfig?.canciones?.length > 0) {
        // ✅ Actualizar volumen desde Firestore
        if (
          newConfig.volumen !== undefined &&
          newConfig.volumen !== this.volumen
        ) {
          this.volumen = newConfig.volumen;
          if (this.audio) {
            this.audio.volume = this.volumen;
          }
          console.log('🔊 Volumen sincronizado desde Firestore:', this.volumen);
        }

        // Si el audio ya existe, actualizar src si cambió
        if (this.audio) {
          const nuevaUrl = newConfig.canciones[0]?.url;
          if (nuevaUrl && this.audio.src !== nuevaUrl) {
            this.audio.src = nuevaUrl;
            if (this.isPlaying) {
              this.audio.play();
            }
          }
        } else {
          // Si no existe audio, inicializar
          this.inicializarAudio();
        }
      } else {
        // Si se deshabilitó el audio, limpiar
        this.limpiarAudio();
      }
    }
  }

  ngOnInit() {
    // ✅ Usar el volumen de Firestore o el default
    if (this.audioConfig?.volumen !== undefined) {
      this.volumen = this.audioConfig.volumen;
    }

    if (
      this.audioConfig?.habilitado &&
      this.audioConfig?.canciones?.length > 0
    ) {
      this.inicializarAudio();
    }
  }

  ngOnDestroy() {
    this.limpiarAudio();
  }

  private limpiarAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.isPlaying = false;
    this.visible = false;
  }

  private inicializarAudio() {
    const url = this.audioConfig?.canciones[0]?.url;
    if (!url) return;

    // ✅ Si ya existe audio, no recrearlo
    if (this.audio) {
      if (this.audio.src === url) return;
      this.audio.src = url;
    } else {
      this.audio = new Audio(url);
    }

    // ✅ Usar el volumen de Firestore
    this.audio.volume = this.volumen;
    this.audio.loop = false;

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

    // ✅ Opcional: Emitir cambio al padre si quieres guardar en Firestore
    console.log('🔊 Volumen cambiado a:', this.volumen);
  }

  // ✅ Getter para usar en el template (valor actual)
  get volumenActual(): number {
    return this.volumen;
  }
}
