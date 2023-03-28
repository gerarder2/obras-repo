import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { CatalogosService } from './../../../services/catalogos.service';
import { Mensaje } from './../../../models/mensaje';
import { TipoObra } from '../models/tipoobra.interface';

@Component({
  selector: 'app-secciones-especiales',
  templateUrl: './secciones-especiales.component.html',
  styleUrls: ['./secciones-especiales.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeccionesEspecialesComponent implements OnInit, OnChanges {
  @Input() puestoSelected: number;
  @Input() anioSelected: number;

  @Output() onFiltrarSecciones: EventEmitter<any> = new EventEmitter();
  @Output() onBorrar: EventEmitter<any> = new EventEmitter();
  @Output() onLoading: EventEmitter<any> = new EventEmitter();

  totalObras = 0;
  montoTotalInversion = 0;
  mensaje: Mensaje;
  seccionesEspeciales = [];

  allSeccionesEspeciales: boolean;
  seccionesEspecialesSeleccionadas = [];
  filtro = {
    obrasSociales: [],
    obras: [],
    municipios: [],
    distritos: [],
    secciones: []
  };

  tiposObra: any[];
  tipoSeleccionado: TipoObra;

  constructor(private catalogosService: CatalogosService) {
    this.mensaje = new Mensaje();
  }

  ngOnInit(): void {
    this.catalogosService
      .getSeccionesEspeciales({ anio: this.anioSelected, puesto: this.puestoSelected })
      .subscribe((resp) => {
        resp.data.sort((p1, p2) =>
          Number(p1.listaNominal) < Number(p2.listaNominal)
            ? 1
            : Number(p1.listaNominal) > Number(p2.listaNominal)
            ? -1
            : 0
        );
        this.seccionesEspeciales = resp.data;
      });
  }

  filtrarSecciones() {
    let seccionesConcatenadas = '';
    for (const [i, seccion] of this.seccionesEspecialesSeleccionadas.entries()) {
      if (i === this.seccionesEspecialesSeleccionadas.length - 1) {
        seccionesConcatenadas += seccion.id;
      } else {
        seccionesConcatenadas += seccion.id + ',';
      }
    }
    this.onLoading.emit('loading');
    this.catalogosService
      .getEleccionesSeccionesEspeciales({
        anio: this.anioSelected,
        idPuesto: this.puestoSelected,
        idDistrito: 0,
        idsSeccionesEspeciales: seccionesConcatenadas
      })
      .subscribe((resp) => {
        const respuesta = { data: resp.data, secciones: seccionesConcatenadas };
        this.onLoading.emit('loaded');
        this.onFiltrarSecciones.emit(respuesta);
      });
  }

  borrarSecciones() {
    console.log('borrar');
    this.seccionesEspecialesSeleccionadas = [];
    this.onBorrar.emit('borrar_layer');
  }

  checkUncheckSeccionesEspeciales() {
    if (this.allSeccionesEspeciales) {
      this.seccionesEspecialesSeleccionadas = this.seccionesEspeciales.slice();
    } else {
      this.seccionesEspecialesSeleccionadas = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['anioSelected']) {
      this.filtro.municipios = changes['anioSelected'].currentValue;
    } else if (changes['puestoSelected']) {
      this.filtro.distritos = changes['puestoSelected'].currentValue;
    }
  }
}
