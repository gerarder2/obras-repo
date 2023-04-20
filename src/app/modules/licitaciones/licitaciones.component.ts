import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-licitaciones',
  templateUrl: './licitaciones.component.html',
  styleUrls: ['./licitaciones.component.scss']
})
export class LicitacionesComponent implements OnInit {
  public licitaciones: any[];
  public tabla1: any[];
  public tabla2: any[];

  constructor() {
    this.licitaciones = [
      { id: 1, cantidad: 300, descripcion: 'TOTAL DE LICITACIONES', color: 'wine' },
      { id: 2, cantidad: 1182, descripcion: 'EVENTOS DE LICITACION', color: 'wine-800' },
      { id: 3, cantidad: 5, descripcion: 'DEPENDENCIAS/ORGANISMOS', color: 'wine-500' }
    ];

    this.tabla1 = [
      { id: 1, nombre: 'SIDUR', progreso: 40, color: 'wine' },
      { id: 2, nombre: 'CEA', progreso: 50, color: 'green' },
      { id: 3, nombre: 'ISIE', progreso: 65, color: 'gold-500' },
      { id: 2, nombre: 'OTROS', progreso: 70, color: 'gold' }
    ];

    this.tabla2 = [
      { id: 1, nombre: 'SIDUR', progreso: 40 },
      { id: 2, nombre: 'CEA', progreso: 50 },
      { id: 3, nombre: 'ISIE', progreso: 65 },
      { id: 2, nombre: 'OTROS', progreso: 70 }
    ];
  }

  ngOnInit(): void {}
}
