import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hashtag-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data" class="section">
      <h3>#️⃣ {{ data }}</h3>
    </div>
  `,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; font-size: 1.5em; }`]
})
export class HashtagSectionComponent {
  @Input() data: any;
}
