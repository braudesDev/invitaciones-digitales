import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hospedaje } from '../../../../../models/hospedaje.model';

@Component({
  selector: 'app-hospedaje-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hospedaje-section.component.html',
  styleUrls: ['./hospedaje-section.component.css'],
})
export class HospedajeSectionComponent {
  @Input() data!: Hospedaje;
}
