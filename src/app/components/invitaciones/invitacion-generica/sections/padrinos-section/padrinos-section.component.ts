import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-padrinos-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './padrinos-section.component.html',
  styleUrls: ['./padrinos-section.component.css'],
})
export class PadrinosSectionComponent {
  @Input() data: any;
}
