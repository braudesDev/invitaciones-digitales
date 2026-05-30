import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-damas-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data && data.length" class="section">
      <h3>👗 Damas</h3>
      <ul>
        <li *ngFor="let dama of data">{{ dama }}</li>
      </ul>
    </div>
  `,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; } ul { list-style: none; padding: 0; }`]
})
export class DamasSectionComponent {
  @Input() data: any;
}
