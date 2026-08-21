// src/app/components/invitaciones/invitacion-generica/sections/footer-section/footer-section.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.css'],
})
export class FooterSectionComponent {
  @Input() data: any;

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
