// src/app/components/image-upload/image-upload.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-upload.html',
  styleUrls: ['./image-upload.css'],
})
export class ImageUploadComponent {
  @Input() label: string = '📸 Seleccionar imagen';
  @Input() imageUrl: string = '';
  @Input() required: boolean = false;
  // ❌ ELIMINAR @Input() placeholder: string = 'URL de la imagen';
  @Output() imageChange = new EventEmitter<string>();

  imagenSubiendo = false;

  constructor(private http: HttpClient) {}

  async subirImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Solo se permiten imágenes', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
      return;
    }

    this.imagenSubiendo = true;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'invitaciones-app');

      const cloudName = 'drsyb53ae';

      const response = await this.http
        .post<{
          secure_url: string;
        }>(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
        )
        .toPromise();

      if (response && response.secure_url) {
        this.imageUrl = response.secure_url;
        this.imageChange.emit(this.imageUrl);
        Swal.fire('✅ Imagen subida correctamente', '', 'success');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    } finally {
      this.imagenSubiendo = false;
    }
  }

  limpiarImagen() {
    this.imageUrl = '';
    this.imageChange.emit('');
  }
}
