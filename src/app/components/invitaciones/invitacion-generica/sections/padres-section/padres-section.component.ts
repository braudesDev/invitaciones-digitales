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
  // ← Implementa OnInit
  @Input() data: any;

  ngOnInit() {
    // ← Agrega este método
    console.log('🔍 DATOS RECIBIDOS EN PADRES-SECTION:');
    console.log('  data completo:', this.data);
    console.log('  padres:', this.data?.padres);
    console.log('  madreNoviaFallecida:', this.data?.madreNoviaFallecida);
    console.log('  padreNoviaFallecido:', this.data?.padreNoviaFallecido);
    console.log('  madreNovioFallecida:', this.data?.madreNovioFallecida);
    console.log('  padreNovioFallecido:', this.data?.padreNovioFallecido);

    // 🔍 Verifica si los datos están anidados en un objeto "padres"
    if (this.data?.padres) {
      console.log(
        '  ⚠️ Los datos están anidados en "padres":',
        this.data.padres,
      );
      console.log(
        '  madreNoviaFallecida en padres:',
        this.data.padres.madreNoviaFallecida,
      );
    }
  }

  isFallecido(nombre: string, fallecido: boolean): boolean {
    return !!nombre && !!fallecido;
  }
}
