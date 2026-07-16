import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recepcion-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recepcion-section.component.html',
  styleUrls: ['./recepcion-section.component.css'],
})
export class RecepcionSectionComponent {
  @Input() data: any;
  @Input() fechaEvento: any;

  encodeURIComponent(text: string): string {
    return encodeURIComponent(text);
  }
}
