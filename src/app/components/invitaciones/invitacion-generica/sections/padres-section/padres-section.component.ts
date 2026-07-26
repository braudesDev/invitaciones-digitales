import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-padres-section',
  standalone: true,
  imports: [],
  templateUrl: './padres-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./padres-section.component.css'],
})
export class PadresSectionComponent implements OnInit {
  @Input() data: any;

  ngOnInit() {}
}
