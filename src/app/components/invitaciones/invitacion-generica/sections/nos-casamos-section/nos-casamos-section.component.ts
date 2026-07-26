import {
  Component,
  Input,
  HostBinding,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';


@Component({
  selector: 'app-nos-casamos-section',
  imports: [],
  standalone: true,
  templateUrl: './nos-casamos-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./nos-casamos-section.component.css'],
})
export class NosCasamosSectionComponent implements OnChanges {
  @Input() frase: string = '';
  @Input() mensaje: string = '';
  @Input() fontFamily: string = 'Playfair Display, serif';
  @Input() colorTexto: string = '#333333'; // 👈 AGREGA ESTA LÍNEA

  // Colores que vienen del formulario
  @Input() primaryColor: string = '#7A8B7D';
  @Input() secondaryColor: string = '#CBB89D';
  @Input() accentColor: string = '#B08A4A';
  @Input() textColor: string = '#3F4A42';
  @Input() imagenFondo: string =
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';

  // Aplicar variables CSS al host
  @HostBinding('style.--primary')
  get primary() {
    return this.primaryColor;
  }

  @HostBinding('style.--secondary')
  get secondary() {
    return this.secondaryColor;
  }

  @HostBinding('style.--accent')
  get accent() {
    return this.accentColor;
  }

  @HostBinding('style.--text')
  get text() {
    return this.textColor;
  }

  @HostBinding('style.--font-title')
  get fontTitle() {
    return this.fontFamily;
  }

  @HostBinding('style.--font-body')
  get fontBody() {
    return this.fontFamily === 'Playfair Display, serif'
      ? 'Georgia, serif'
      : this.fontFamily;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['frase'] || changes['mensaje']) {
      console.log(
        'Seccion "Nos casamos" actualizada: ',
        this.frase,
        this.mensaje,
      );
    }
  }
}
