import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-itinerario-section',
  standalone: true,
  imports: [],
  template: `
    @if (data) {
      <div class="section">
        <h3>📅 Itinerario</h3>
        @if (data.titulo) {
          <p><strong>{{ data.titulo }}</strong></p>
        }
        @for (item of data.items; track item) {
          <div class="itinerario-item">
            <span class="hora">{{ item.hora }}</span>
            <span class="actividad">{{ item.actividad }}</span>
          </div>
        }
      </div>
    }
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    .section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; }
    .itinerario-item { margin: 10px 0; }
    .hora { font-weight: bold; margin-right: 10px; }
  `]
})
export class ItinerarioSectionComponent {
  @Input() data: any;
}
