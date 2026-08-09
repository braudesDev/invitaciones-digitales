import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-ceremonia-section',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './ceremonia-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
