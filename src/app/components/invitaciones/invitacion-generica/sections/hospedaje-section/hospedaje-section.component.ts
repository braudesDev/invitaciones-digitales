import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Hospedaje } from '../../../../../models/hospedaje.model';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-hospedaje-section',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './hospedaje-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./hospedaje-section.component.css'],
})
export class HospedajeSectionComponent {
  @Input() data!: Hospedaje;
}
