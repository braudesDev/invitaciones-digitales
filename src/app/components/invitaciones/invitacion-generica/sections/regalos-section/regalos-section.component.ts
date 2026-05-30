import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-regalos-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './regalos-section.component.html',
  styleUrls: ['./regalos-section.component.css']
})
export class RegalosSectionComponent {
  @Input() data: any;
}
