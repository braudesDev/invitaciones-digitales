import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-padres-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data" class="section">
      <h3>👪 Padres</h3>
      <p *ngIf="data.padreNovia">Padre de la Novia: {{ data.padreNovia }}</p>
      <p *ngIf="data.madreNovia">Madre de la Novia: {{ data.madreNovia }}</p>
      <p *ngIf="data.padreNovio">Padre del Novio: {{ data.padreNovio }}</p>
      <p *ngIf="data.madreNovio">Madre del Novio: {{ data.madreNovio }}</p>
    </div>
  `,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; }`]
})
export class PadresSectionComponent {
  @Input() data: any;
}
