import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hospedaje-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data" class="section">
      <h3>🏨 Hospedaje</h3>
      <div *ngFor="let hotel of data.hoteles">
        <p><strong>{{ hotel.nombre }}</strong></p>
        <p>{{ hotel.direccion }}</p>
        <a *ngIf="hotel.link" [href]="hotel.link" target="_blank">Ver más</a>
      </div>
    </div>
  `,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; }`]
})
export class HospedajeSectionComponent {
  @Input() data: any;
}
