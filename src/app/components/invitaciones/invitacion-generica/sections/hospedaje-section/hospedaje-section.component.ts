import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Hospedaje } from '../../../../../models/hospedaje.model';

@Component({
  selector: 'app-hospedaje-section',
  standalone: true,
  imports: [],
  templateUrl: './hospedaje-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./hospedaje-section.component.css'],
})
export class HospedajeSectionComponent {
  @Input() data!: Hospedaje;
}
