import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-hashtag-section',
  standalone: true,
  imports: [],
  template: `
    @if (data) {
      <div class="section">
        <h3>#️⃣ {{ data }}</h3>
      </div>
    }
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; font-size: 1.5em; }`]
})
export class HashtagSectionComponent {
  @Input() data: any;
}
