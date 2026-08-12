// src/app/components/invitaciones/invitacion-generica/sections/regalos-section/regalos-section.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core'; //
import { Regalos } from '../../../../../models/regalos.model';

@Component({
  selector: 'app-regalos-section',
  standalone: true,
  imports: [CommonModule, NgIcon], // 👈 AGREGAR A IMPORTS
  templateUrl: './regalos-section.component.html',
  styleUrls: ['./regalos-section.component.css'],
})
export class RegalosSectionComponent {
  @Input() data!: Regalos;
  @Input() fontFamily: string = "'Playfair Display', Georgia, serif";
}
