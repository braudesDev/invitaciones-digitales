import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core'; // 👈 IMPORTAR

@Component({
  selector: 'app-hashtag-section',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './hashtag-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./hashtag-section.component.css'],
})
export class HashtagSectionComponent implements OnInit {
  @Input() data!: {
    titulo: string;
    subtitulo: string;
    hashtag: string;
    mensaje: string;
    icono: string;
    mostrarIcono: boolean;
    resaltarHashtag: boolean;
    mostrarCaracteristicas: boolean;
  };

  ngOnInit() {}
}
