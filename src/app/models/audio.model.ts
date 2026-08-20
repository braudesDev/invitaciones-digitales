// src/app/models/audio.model.ts

export interface AudioConfig {
  habilitado: boolean;
  canciones: Cancion[];
  volumen: number; // 0 a 1
  autoPlay: boolean;
}

export interface Cancion {
  id?: string;
  nombre: string;
  artista?: string;
  url: string; // URL del archivo MP3 (Firebase Storage o URL externa)
  duracion?: string; // Opcional: "3:45"
}
