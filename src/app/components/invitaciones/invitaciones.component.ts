import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { map, switchMap, first } from 'rxjs/operators';
import { Observable, of, firstValueFrom } from 'rxjs';
import {
  InvitacionesService,
  Invitacion,
} from '../../services/invitaciones.service';
import { InvitadosService } from '../../services/invitados.service';
import { InvitacionGenericaComponent } from './invitacion-generica/invitacion-generica.component';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-invitaciones',
  standalone: true,
  imports: [CommonModule, InvitacionGenericaComponent, NgIcon],
  templateUrl: './invitaciones.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./invitaciones.component.css'],
})
export class InvitacionesComponent implements OnInit {
  invitacion$?: Observable<Invitacion | undefined>;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private invitacionesService: InvitacionesService,
    private invitadosService: InvitadosService,
    private meta: Meta,
    private title: Title,
    private firestore: Firestore,
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.cargando = false;
      return;
    }

    try {
      // ✅ Usar firstValueFrom para esperar el resultado
      const invitadoData = await firstValueFrom(
        this.invitadosService.getInvitadoPorSlug(slug),
      );

      if (!invitadoData) {
        console.log('❌ No se encontró invitado con slug:', slug);
        this.cargando = false;
        return;
      }

      const eventoRef = collection(this.firestore, 'invitaciones');
      const eventoQuery = query(
        eventoRef,
        where('slug', '==', invitadoData.eventoSlug),
      );

      const docs = await firstValueFrom(
        collectionData<any>(eventoQuery, { idField: 'id' }),
      );

      const eventoDoc = docs[0];
      if (!eventoDoc) {
        this.cargando = false;
        return;
      }

      const invitacionCompleta: Invitacion = {
        ...eventoDoc,
        id: eventoDoc.id ?? '',
        fecha: eventoDoc.fecha ? new Date(eventoDoc.fecha) : new Date(),
        invitado: invitadoData.nombre,
        pases: invitadoData.pases,
        mensajePersonalizado: invitadoData.mensajePersonalizado,
      };

      this.setMetaTags(invitacionCompleta, invitadoData.nombre);

      // ✅ Asignar el resultado
      this.invitacion$ = of(invitacionCompleta);
      this.cargando = false;
    } catch (error) {
      this.cargando = false;
    }
  }

  private setMetaTags(inv: Invitacion, nombreInvitado?: string) {
    const titulo = nombreInvitado
      ? `${inv.name} - Invitación para ${nombreInvitado}`
      : `${inv.name} | On Off Shot Invitaciones`;

    this.title.setTitle(titulo);
    this.meta.updateTag({ property: 'og:title', content: titulo });
    this.meta.updateTag({
      property: 'og:description',
      content: nombreInvitado
        ? `${nombreInvitado}, te esperamos en ${inv.name}. ¡Confirma tu asistencia!`
        : `Te invitamos a ${inv.name}. ¡Haz clic para ver los detalles!`,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: inv.shareImage ?? 'assets/default-share.jpg',
    });
  }
}
