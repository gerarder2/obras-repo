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
import { Distrito } from '../models/distrito.interface';
import { Mensaje } from './../../../models/mensaje';
import { Municipio } from './../models/municipio.interface';
import { TipoObra } from '../models/tipoobra.interface';

@Component({
  selector: 'app-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObrasComponent implements OnInit, OnChanges {
  @Input() municipiosSelected: Municipio[] = [];
  @Input() distritosSelected: Distrito[] = [];
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onBorrar: EventEmitter<any> = new EventEmitter();

  totalObras = 0;
  montoTotalInversion = 0;
  grupoTiposObra: any[] = [];
  mensaje: Mensaje;

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
    // this.tiposObra = [
    //   { id: 1, nombre: 'Tipo 1' },
    //   { id: 1, nombre: 'Tipo 2' },
    //   { id: 3, nombre: 'Tipo 3' }
    // ];
    this.filtro.municipios = this.municipiosSelected.map((object) => object.id);
    this.filtro.distritos = this.distritosSelected.map((object) => object.id);

    this.tiposObra = [
      {
        label: 'Documents',
        data: {},
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: [
          {
            label: 'Work',
            data: 'Work Folder',
            icon: 'pi pi-folder'
          },
          {
            label: 'Home',
            data: 'Home Folder',
            icon: 'pi pi-folder'
          }
        ]
      }
    ];

    this.catalogosService.getObrasTiposObra().subscribe((response) => {
      this.tiposObra = response;
    });
  }

  agregarEliminarNodos($event, type: string) {
    if (type === 'agregar') {
      if (!$event.node.parent) {
        this.filtro.obrasSociales.push({ id: $event.node.data.id });
        for (const element of $event.node.data.tiposObra) {
          this.filtro.obras.push({ id: element.id });
        }
      } else {
        this.filtro.obras.push({ id: $event.node.data.id });

        //REVISAR QUE NO EXISTA PREVIAMENTE
        const exists = this.filtro.obrasSociales.some((obra) => obra.id === $event.node.parent.data.id);
        if (!exists) {
          this.filtro.obrasSociales.push({ id: $event.node.parent.data.id });
        }
      }
    } else if (type === 'eliminar') {
      if (!$event.node.parent) {
        // Elimnar el nodo padre con sus hijos (obras sociales y tipos obra)
        const indexToDelete = this.filtro.obrasSociales.findIndex(
          (obraSocial) => obraSocial.id === $event.node.data.id
        );
        if (indexToDelete !== -1) {
          this.filtro.obrasSociales.splice(indexToDelete, 1);
        }
        for (const element of $event.node.data.tiposObra) {
          const indexToDelete = this.filtro.obras.findIndex((obra) => obra.id === element.id);
          if (indexToDelete !== -1) {
            this.filtro.obras.splice(indexToDelete, 1);
          }
        }
      } else {
        // Eliminar obra seleccionada
        const indexToDelete = this.filtro.obras.findIndex((obra) => obra.id === $event.node.data.id);
        if (indexToDelete !== -1) {
          this.filtro.obras.splice(indexToDelete, 1);
        }

        // Validar si la obra eliminada es la ultima del conjunto
        const exists = $event.node.parent.data.tiposObra.some((objA) =>
          this.filtro.obras.some((objB) => objB.id === objA.id)
        );

        // Eliminar la obra social asociada a la obra ultima del conjunto
        if (!exists) {
          const indexToDelete = this.filtro.obrasSociales.findIndex((obra) => obra.id === $event.node.parent.data.id);
          if (indexToDelete !== -1) {
            this.filtro.obrasSociales.splice(indexToDelete, 1);
          }
        }
      }
    }
  }

  filtrarObras() {
    const payload = {
      idsMunicipios: this.filtro.municipios.toString() || 0,
      idsTiposObraSocial: this.filtro.obrasSociales.map((obj) => obj.id).toString() || 0,
      idsTiposObra: this.filtro.obras.map((obj) => obj.id).toString() || 0
    };
    this.catalogosService.getObras(this.tiposObra, payload).subscribe((response: any) => {
      if (response.data !== null && response.data.length > 0) {
        this.onFilter.emit(response);
        this.totalObras = response.totalObras;
        this.montoTotalInversion = response.montoTotalInversion;
        this.grupoTiposObra = response.grupoTiposObra;
      } else {
        this.mensaje.showMessage(response);
      }
    });
  }

  borrarObras() {
    this.onBorrar.emit('borrar_layer');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['municipiosSelected']) {
      this.filtro.municipios = changes['municipiosSelected'].currentValue.map((object) => object.id);
    } else if (changes['distritosSelected']) {
      this.filtro.distritos = changes['distritosSelected'].currentValue.map((object) => object.id);
    }
  }
}
