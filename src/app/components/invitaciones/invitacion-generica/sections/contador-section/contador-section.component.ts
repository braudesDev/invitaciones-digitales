import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contador-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data" class="section">
      <h3>⏰ Contador</h3>
      <p>Faltan {{ diasFaltantes }} días</p>
    </div>
  `,
  styles: [`.section { margin: 20px; padding: 15px; border-radius: 8px; background: #f5f5f5; text-align: center; font-size: 1.2em; }`]
})
export class ContadorSectionComponent {
  @Input() data: any;
  get diasFaltantes(): number {
    const fechaObjetivo = new Date(this.data?.fechaObjetivo);
    const hoy = new Date();
    const diff = fechaObjetivo.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}
