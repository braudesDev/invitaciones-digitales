import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galeria-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="fotos && fotos.length > 0" class="galeria-section">
      <div class="section-header">
        <div class="section-icon">📸</div>
        <h3>Galería de Recuerdos</h3>
      </div>
      <div class="galeria-grid">
        <div class="galeria-item" *ngFor="let foto of fotos; let i = index">
          <img [src]="foto" [alt]="'Foto ' + (i+1)" loading="lazy" (click)="abrirModal(i)">
        </div>
      </div>
      
      <!-- Modal para ver foto grande -->
      <div class="modal" [class.active]="modalAbierto" (click)="cerrarModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <span class="modal-close" (click)="cerrarModal()">&times;</span>
          <img [src]="fotoActual" alt="Foto grande">
          <button class="modal-prev" (click)="anterior()">❮</button>
          <button class="modal-next" (click)="siguiente()">❯</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .galeria-section {
      margin: 40px auto;
      padding: 30px 20px;
      max-width: 900px;
      background: white;
      border-radius: 32px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }
    .section-header { text-align: center; margin-bottom: 30px; }
    .section-icon { font-size: 48px; margin-bottom: 10px; }
    .galeria-section h3 { font-size: 1.8rem; color: #2c3e50; font-family: 'Playfair Display', serif; margin: 0; }
    .galeria-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }
    .galeria-item {
      cursor: pointer;
      overflow: hidden;
      border-radius: 16px;
      aspect-ratio: 1;
    }
    .galeria-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .galeria-item img:hover { transform: scale(1.05); }
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }
    .modal.active { display: flex; }
    .modal-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
    }
    .modal-content img {
      width: 100%;
      height: auto;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
    }
    .modal-close {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 35px;
      cursor: pointer;
    }
    .modal-prev, .modal-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.3);
      border: none;
      color: white;
      font-size: 24px;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 50%;
    }
    .modal-prev { left: -50px; }
    .modal-next { right: -50px; }
    @media (max-width: 768px) {
      .galeria-grid { grid-template-columns: repeat(2, 1fr); }
      .modal-prev { left: 10px; }
      .modal-next { right: 10px; }
    }
  `]
})
export class GaleriaSectionComponent {
  @Input() fotos: string[] = [];
  modalAbierto = false;
  fotoActual = '';
  indiceActual = 0;

  abrirModal(index: number) {
    this.indiceActual = index;
    this.fotoActual = this.fotos[index];
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  anterior() {
    this.indiceActual = (this.indiceActual - 1 + this.fotos.length) % this.fotos.length;
    this.fotoActual = this.fotos[this.indiceActual];
  }

  siguiente() {
    this.indiceActual = (this.indiceActual + 1) % this.fotos.length;
    this.fotoActual = this.fotos[this.indiceActual];
  }
}
