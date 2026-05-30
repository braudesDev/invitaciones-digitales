import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consideraciones-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data" class="section">
      <h3>📋 Consideraciones</h3>
      <p>{{ data }}</p>
    </div>
  `,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; }`]
})
export class ConsideracionesSectionComponent {
  @Input() data: any;
}
