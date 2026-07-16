import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-padres-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './padres-section.component.html',
  styleUrls: ['./padres-section.component.css'],
})
export class PadresSectionComponent implements OnInit {
  @Input() data: any;

  ngOnInit() {}
}
