import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ceremonia-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ceremonia-section.component.html',
  styleUrls: ['./ceremonia-section.component.css'],
})
export class CeremoniaSectionComponent {
  @Input() data: any; // Datos de la ceremonia
  @Input() recepcionData: any; //  NUEVO: Datos de la recepción
  @Input() fechaEvento: any; //

  encodeURIComponent(text: string): string {
    return encodeURIComponent(text);
  }
}
