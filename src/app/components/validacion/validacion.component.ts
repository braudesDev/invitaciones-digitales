import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-validacion',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.css']
})
export class ValidacionComponent implements AfterViewInit {
  modoEscaneo = true;
  qrTexto = '';
  resultadoValidacion: any = null;
  error = '';
  validando = false;
  registrando = false;
  scannerEnabled = true;
  camaraDisponible = false;

  constructor(private firestore: Firestore) {}

  ngAfterViewInit() {
    this.verificarCamara();
  }

  async verificarCamara() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      this.camaraDisponible = videoDevices.length > 0;
      if (!this.camaraDisponible) {
        this.error = 'No se encontró cámara en este dispositivo';
        this.modoEscaneo = false;
      }
    } catch (err) {
      this.error = 'No se pudo acceder a la cámara';
      this.modoEscaneo = false;
    }
  }

  onScanSuccess(result: string) {
    if (result && !this.validando) {
      this.scannerEnabled = false;
      this.qrTexto = result;
      this.validarQR();
    }
  }

  onScanError(error: any) {
    // Solo mostrar error si es grave
    if (error && error.message && error.message.includes('NotAllowedError')) {
      this.error = 'Permiso denegado para usar la cámara';
      this.modoEscaneo = false;
    }
  }

  cambiarModo() {
    this.modoEscaneo = !this.modoEscaneo;
    if (this.modoEscaneo) {
      this.scannerEnabled = true;
      setTimeout(() => this.verificarCamara(), 500);
    }
    this.limpiar();
  }

  async validarQR() {
    if (!this.qrTexto.trim()) {
      this.error = '📱 Escanea o pega un código QR';
      return;
    }

    this.validando = true;
    this.error = '';
    this.resultadoValidacion = null;

    try {
      let datos;
      try {
        datos = JSON.parse(this.qrTexto);
      } catch (e) {
        this.error = '❌ QR inválido. Asegúrate de escanear el QR correctamente.';
        this.validando = false;
        return;
      }

      if (datos.tipo !== 'validacion-invitacion' && !datos.invitadoId) {
        this.error = '❌ Este QR no es una invitación válida';
        this.validando = false;
        return;
      }

      await this.buscarInvitado(datos);
    } catch (error) {
      this.error = '❌ Error al procesar el QR';
    } finally {
      this.validando = false;
    }
  }

  async buscarInvitado(datos: any) {
    try {
      const invitadoId = datos.invitadoId;
      const invitadoRef = doc(this.firestore, `invitados/${invitadoId}`);
      const invitadoSnap = await getDoc(invitadoRef);

      if (!invitadoSnap.exists()) {
        this.resultadoValidacion = {
          acceso: false,
          mensaje: '❌ INVITACIÓN NO VÁLIDA',
          invitado: datos.invitado || 'Desconocido',
          pases: datos.pases || 1,
          evento: datos.evento || 'Evento',
          confirmado: false,
          yaIngreso: false
        };
        return;
      }

      const invitadoData = invitadoSnap.data();
      const estaConfirmado = invitadoData['estado'] === 'confirmado';
      const yaIngreso = invitadoData['ingreso'] === true;
      const accesoValido = estaConfirmado && !yaIngreso;

      this.resultadoValidacion = {
        id: invitadoId,
        acceso: accesoValido,
        mensaje: accesoValido 
          ? '✅ ACCESO CONCEDIDO' 
          : yaIngreso 
            ? '⛔ ACCESO DENEGADO - YA INGRESÓ'
            : '⛔ ACCESO DENEGADO - NO CONFIRMÓ',
        invitado: datos.invitado || invitadoData['nombre'],
        pases: datos.pases || invitadoData['pases'],
        evento: datos.evento || 'Evento',
        lugar: datos.lugar || 'No especificado',
        confirmado: estaConfirmado,
        yaIngreso: yaIngreso
      };
    } catch (error) {
      this.error = '❌ Error al conectar con la base de datos';
    }
  }

  async marcarIngreso() {
    if (!this.resultadoValidacion?.id || !this.resultadoValidacion.acceso) return;

    this.registrando = true;
    try {
      const invitadoRef = doc(this.firestore, `invitados/${this.resultadoValidacion.id}`);
      await updateDoc(invitadoRef, { 
        ingreso: true, 
        ingresoHora: new Date().toISOString()
      });

      this.resultadoValidacion.yaIngreso = true;
      this.resultadoValidacion.acceso = false;
      this.resultadoValidacion.mensaje = '✅ INGRESO REGISTRADO';

      alert(`🎉 ${this.resultadoValidacion.invitado} ha ingresado. Bienvenido!`);
      // Reiniciar escáner para el siguiente
      setTimeout(() => {
        this.scannerEnabled = true;
        this.limpiar();
      }, 2000);
    } catch (error) {
      alert('❌ Error al registrar ingreso');
    } finally {
      this.registrando = false;
    }
  }

  reiniciarEscanner() {
    this.scannerEnabled = true;
    this.limpiar();
  }

  limpiar() {
    this.qrTexto = '';
    this.resultadoValidacion = null;
    this.error = '';
  }

  simularEscaneo() {
    this.modoEscaneo = false;
    this.qrTexto = JSON.stringify({
      tipo: 'validacion-invitacion',
      invitadoId: 'prueba-id',
      invitado: 'Invitado Prueba',
      pases: 2,
      evento: 'Evento de Prueba',
      confirmado: true
    });
    this.validarQR();
  }
}
