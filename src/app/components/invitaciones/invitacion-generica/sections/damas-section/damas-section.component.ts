import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-damas-section',
  standalone: true,
  imports: [],
  template: `
    @if (data && data.length) {
      <div class="section">
        <h3>👗 Damas</h3>
        <ul>
          @for (dama of data; track dama) {
            <li>{{ dama }}</li>
          }
        </ul>
      </div>
    }
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; } ul { list-style: none; padding: 0; }`]
})
export class DamasSectionComponent {
  @Input() data: any;
}
