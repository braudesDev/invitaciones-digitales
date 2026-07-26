import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-consideraciones-section',
  standalone: true,
  imports: [],
  template: `
    @if (data) {
      <div class="section">
        <h3>📋 Consideraciones</h3>
        <p>{{ data }}</p>
      </div>
    }
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; }`]
})
export class ConsideracionesSectionComponent {
  @Input() data: any;
}
