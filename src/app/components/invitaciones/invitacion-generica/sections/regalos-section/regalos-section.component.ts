import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-regalos-section',
  standalone: true,
  imports: [],
  templateUrl: './regalos-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./regalos-section.component.css']
})
export class RegalosSectionComponent {
  @Input() data: any;
}
