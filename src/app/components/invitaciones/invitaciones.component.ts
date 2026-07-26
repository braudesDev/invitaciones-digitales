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
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  InvitacionesService,
  Invitacion,
} from '../../services/invitaciones.service';
import { InvitadosService } from '../../services/invitados.service';
import { InvitacionGenericaComponent } from './invitacion-generica/invitacion-generica.component';

@Component({
  selector: 'app-invitaciones',
  standalone: true,
  imports: [CommonModule, InvitacionGenericaComponent],
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

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.cargando = false;
      return;
    }

    // 🔍 PASO 1: Buscar al INVITADO por su slug
    this.invitacion$ = this.invitadosService.getInvitadoPorSlug(slug).pipe(
      switchMap((invitadoData) => {
        if (!invitadoData) {
          console.log('❌ No se encontró invitado con slug:', slug);
          return of(undefined);
        }

        console.log('✅ Invitado encontrado:', invitadoData);

        // 📋 PASO 2: Buscar la INVITACIÓN (evento) usando eventoSlug
        const eventoRef = collection(this.firestore, 'invitaciones');
        const eventoQuery = query(
          eventoRef,
          where('slug', '==', invitadoData.eventoSlug),
        );

        return collectionData<any>(eventoQuery, { idField: 'id' }).pipe(
          map((docs) => {
            const eventoDoc = docs[0];
            if (!eventoDoc) {
              console.log(
                '❌ No se encontró evento con slug:',
                invitadoData.eventoSlug,
              );
              return undefined;
            }

            console.log('✅ Evento encontrado:', eventoDoc);

            // 🎯 PASO 3: COMBINAR datos del evento + datos del invitado
            const invitacionCompleta: Invitacion = {
              ...eventoDoc,
              id: eventoDoc.id ?? '',
              fecha: eventoDoc.fecha ? new Date(eventoDoc.fecha) : new Date(),

              // 👇 Sobrescribir con datos del invitado
              invitado: invitadoData.nombre,
              pases: invitadoData.pases,
              mensajePersonalizado: invitadoData.mensajePersonalizado,
            };

            console.log('📦 Invitación combinada:', invitacionCompleta);
            this.setMetaTags(invitacionCompleta, invitadoData.nombre);
            return invitacionCompleta;
          }),
        );
      }),
    );

    this.cargando = false;
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
