import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-itinerario-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data" class="section">
      <h3>📅 Itinerario</h3>
      <p *ngIf="data.titulo"><strong>{{ data.titulo }}</strong></p>
      <div *ngFor="let item of data.items" class="itinerario-item">
        <span class="hora">{{ item.hora }}</span>
        <span class="actividad">{{ item.actividad }}</span>
      </div>
    </div>
  `,
  styles: [`
    .section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; }
    .itinerario-item { margin: 10px 0; }
    .hora { font-weight: bold; margin-right: 10px; }
  `]
})
export class ItinerarioSectionComponent {
  @Input() data: any;
}
