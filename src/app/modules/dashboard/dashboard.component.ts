import * as L from 'leaflet';

import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AuthenticationService } from '../../services';
import { CardInformationComponent } from './card-information/card-information.component';
import { CatalogosService } from './../../services/catalogos.service';
import { ConfigService } from './../../services/config.service';
import { Distrito } from './models/distrito.interface';
import { HelperService } from './../../helpers/helper.service';
import { LocalStorageService } from './../../services/local-storage.service';
import { Mensaje } from './../../models/mensaje';
import { Municipio } from './models/municipio.interface';
import { Partido } from './models/partido.interface';
import { Puesto } from './models/puesto.interface';
import { Router } from '@angular/router';
import { Seccion } from './models/seccion.interface';
import { TipoObra } from './models/tipoobra.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ObrasModalComponent } from '../obras/modal/obras-modal.component';
import { Totales } from './models/totales.interface';
import { ObrasService } from '../obras/services/obras.service';
import { ModalPorMunicipioComponent } from '../obras/modal-por-municipio/modal-por-municipio.component';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  entryComponents: [CardInformationComponent]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapContainer: ElementRef;
  @BlockUI('map-list') blockUIList: NgBlockUI;

  map: L.Map;
  geoJson: L.GeoJSON;
  LeafIcon: any;
  dynamicIcon: any;
  geoJsonFeatureMunicipios: any;
  geoJsonFeatureMunicipiosPuntos: any;
  geoJsonFeatureDistritos: any;
  geoJsonFeatureDistritosPuntos: any;
  geoJsonFeatureSecciones: any;
  zoom = 10;

  sidebarOpen = false;
  asidebarOpen = false;

  periodos: any[];
  periodoSeleccionado: any;
  periodo: any;

  municipios: Municipio[] = [];
  municipiosLoading = false;
  municipioSeleccionado: Municipio;
  municipiosSeleccionados: Municipio[];
  allMunicipios = false;
  isCollapsedMunicipios = true;

  distritos: Distrito[] = [];
  distritoSeleccionado: Distrito;
  distritosSeleccionados: Distrito[];
  allDistritos = false;
  isCollapsedDistritos = true;

  puestos: Puesto[];
  partidos: Partido[];
  puestoSeleccionado: Puesto;
  partidosSwitch: { partidosDistritos?: Partido[]; partidosMunicipios?: Partido[]; partidosSecciones?: Seccion[] };

  votosMunicipio: any;
  votosDistrito: any;
  votosSeccion: any;
  votosSeccionEspecial: any;

  mensaje: Mensaje;
  bsModalRef: BsModalRef;

  seccionMarkersLayer: any;
  seccionSeleccionada: Seccion;
  seccionesActuales: Seccion[];
  labelSeccionesDistritos: string;
  seccionesEspeciales: Seccion[] = [];

  obrasMarksLayer: any;

  cards: any[];
  tiposObras: TipoObra[];
  estatusObras: any[];
  estatusObrasSeleccionado: any;

  puntosMapa: any;
  totales: Totales;
  montoInversion: number;
  montoInversionActual: number;

  markObrasId: any[] = [];

  configCollapsed = false;
  listaItems: any[];
  elementoActivo: number;

  listaPeriodos: any[];
  listaCarreteras: any[];

  fechaActual: Date = new Date();
  annioActual: number = this.fechaActual.getFullYear();

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private configService: ConfigService,
    private catalogosService: CatalogosService,
    private helperService: HelperService,
    private localStorage: LocalStorageService,
    private applicationRef: ApplicationRef,
    private viewRef: ViewContainerRef,
    private inj: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private bsModalService: BsModalService,
    private obrasService: ObrasService
  ) {
    const config = this.configService.getConfig();
    this.montoInversion = 0;
    this.montoInversionActual = 0;
    this.periodos = config.periodos;
    this.periodo = 'Todos';
    this.elementoActivo = -1;

    this.LeafIcon = L.Icon.extend({
      options: {
        iconSize: [32, 32]
      }
    });
    this.dynamicIcon = new this.LeafIcon({ iconUrl: 'assets/markers/mark_1.svg' });
    L.Icon.Default.imagePath = 'assets/markers/';
    this.mensaje = new Mensaje();

    this.votosMunicipio = [];
    this.votosDistrito = [];
    this.partidosSwitch = { partidosDistritos: [], partidosMunicipios: [] };

    this.distritosSeleccionados = [];
    this.municipiosSeleccionados = [];
    this.labelSeccionesDistritos = '';
    this.seccionesActuales = [];

    this.periodoSeleccionado = 0;

    this.municipios = [
      { id: 0, nombre: 'TODOS LOS MUNICIPIOS', latitud: 25.91194, longitud: -109.1735 },
      { id: 1, nombre: 'AHOME', latitud: 25.91194, longitud: -109.1735 },
      { id: 2, nombre: 'ANGOSTURA', latitud: 25.36797, longitud: -108.15913 },
      { id: 3, nombre: 'BADIRAGUATO', latitud: 25.36285, longitud: -107.54986 },
      { id: 4, nombre: 'CONCORDIA', latitud: 23.28819, longitud: -106.06721 },
      { id: 5, nombre: 'COSALA', latitud: 24.73518, longitud: -106.90657 },
      { id: 6, nombre: 'CULIACÁN', latitud: 24.59119, longitud: -107.39151 },
      { id: 7, nombre: 'CHOIX', latitud: 26.80709, longitud: -108.42723 },
      { id: 8, nombre: 'ELOTA', latitud: 24.08861, longitud: -106.82452 },
      { id: 9, nombre: 'ESCUINAPA', latitud: 22.78469, longitud: -105.85171 },
      { id: 10, nombre: 'EL FUERTE', latitud: 25.90437, longitud: -108.94429 },
      { id: 11, nombre: 'GUASAVE', latitud: 25.526, longitud: -108.60869 },
      { id: 12, nombre: 'MAZATLAN', latitud: 23.1615, longitud: -106.2645 },
      { id: 13, nombre: 'MOCORITO', latitud: 25.00644, longitud: -107.63246 },
      { id: 14, nombre: 'ROSARIO', latitud: 22.9921295, longitud: -105.899264 },
      { id: 15, nombre: 'SALVADOR ALVARADO', latitud: 25.4819, longitud: -108.16205 },
      { id: 16, nombre: 'SAN IGNACIO', latitud: 24.07914, longitud: -106.37004 },
      { id: 17, nombre: 'SINALOA', latitud: 25.69983, longitud: -107.87211 },
      { id: 18, nombre: 'NAVOLATO', latitud: 24.65792, longitud: -107.53742 }
    ];

    this.tiposObras = [];
    this.cards = [
      { id: 1, cantidad: 1069, descripcion: 'TOTAL DE CONTRATOS', imagen: 'contrato-icon.svg' },
      { id: 2, cantidad: 18, descripcion: 'MUNICIPIOS BENEFICIADOS', imagen: 'municipios-icon.svg' },
      { id: 3, cantidad: 2929438639.42, descripcion: 'MONTO TOTAL EJERCIDO', imagen: 'montototal-icon.svg' }
    ];
    this.estatusObras = [
      { id: 0, descripcion: 'TODAS' },
      { id: 1, descripcion: 'POR HACER' },
      { id: 2, descripcion: 'EN PROCESO' },
      { id: 3, descripcion: 'TERMINADO' }
    ];
  }

  ngOnInit() {
    this.loadCatalogos();
    this.loadTotales();
    this.helperService.getIdObraSeleccionada().subscribe((idObra) => {
      const markEncontrado = this.markObrasId.find((objeto) => objeto.id === idObra);
      if (markEncontrado) {
        this.loadObraDetalle(
          markEncontrado.marker,
          markEncontrado.id,
          markEncontrado.popupComponentRef,
          markEncontrado.popup
        );
      }
    });

    this.listaItems = [];
    this.listaPeriodos = [];
    this.listaCarreteras = [
      {
        label: 'Caminos y Carreteras',
        valor: 0,
        totales: 0
      },
      {
        label: 'KM Rehabilitados',
        valor: 0,
        totales: 0
      },
      {
        label: 'KM Pavimentados',
        valor: 0,
        totales: 0
      }
    ];

    console.log(this.listaItems);
  }

  ngAfterViewInit() {
    this.inicializarMapa();
  }

  loadCatalogos() {
    this.catalogosService.getCatalogos().subscribe({
      next: (data: any[]) => {
        this.tiposObras = this.helperService.formatTipoObras(data[0].data);

        // this.partidos = data[1].data;
        // this.distritos = data[2].data;
        this.populateDropdowns();
      },
      error: (err: unknown) => {
        console.warn(err);
        this.mensaje.showMessage(err);
      }
    });
  }

  populateDropdowns() {
    this.municipioSeleccionado = this.municipios[0];
    this.periodoSeleccionado = this.periodos[0];
    this.estatusObrasSeleccionado = this.estatusObras[0];
  }

  loadPuntosObra() {
    const payload = {
      idTipoObraSocial: 0,
      idMunicipio: 0,
      ejercicio: 0,
      estatus: 'TODAS'
    };
    this.catalogosService.getMapaObras(payload).subscribe({
      next: (response) => {
        this.puntosMapa = response;
        const info = {
          tiposObras: this.tiposObras,
          puntosMapa: this.puntosMapa,
          idMunicipio: this.municipioSeleccionado.id,
          estatus: this.estatusObrasSeleccionado.descripcion
        };
        const newPuntosMapa = this.helperService.filtrarData(info);
        this.montoInversion = newPuntosMapa.data.reduce((total, x) => total + x.montoInversion, 0);

        this.montoInversionActual = newPuntosMapa.data
          .filter((elemento) => parseInt(elemento.ejercicio) === this.annioActual)
          .reduce((suma, elemento) => suma + elemento.montoInversion, 0);

        this.calcularKms(newPuntosMapa.data);

        if (newPuntosMapa.data.length > 0) {
          const conteo = this.helperService.calcularConteoTiposObras(this.tiposObras, newPuntosMapa.data);
          this.tiposObras = conteo;
          this.mostrarPuntosObra(newPuntosMapa);
        } else {
          if (this.obrasMarksLayer) {
            this.map.removeLayer(this.obrasMarksLayer);
          }
          this.mensaje.messageWarning('Filtro sin resultados');
        }
      },
      error: (err: unknown) => {
        console.warn(err);
        this.mensaje.showMessage(err);
      }
    });
  }

  filtrar() {
    const payload = {
      idTipoObraSocial: 0,
      idMunicipio: 0,
      ejercicio: 0,
      estatus: 'TODAS'
    };

    if (this.periodoSeleccionado.descripcion !== 'Todos') {
      if (this.periodo !== this.periodoSeleccionado.descripcion) {
        this.periodo = this.periodoSeleccionado.descripcion;
        payload.ejercicio = parseInt(this.periodoSeleccionado.descripcion);
        payload.idMunicipio = this.municipioSeleccionado.id;
        payload.estatus = this.estatusObrasSeleccionado.descripcion;

        this.catalogosService.getMapaObras(payload).subscribe({
          next: (response: any) => {
            this.puntosMapa = response;
            const info = {
              tiposObras: this.tiposObras,
              puntosMapa: this.puntosMapa,
              idMunicipio: this.municipioSeleccionado.id,
              estatus: this.estatusObrasSeleccionado.descripcion
            };
            const newPuntosMapa = this.helperService.filtrarData(info);

            if (newPuntosMapa.data.length > 0) {
              const conteo = this.helperService.calcularConteoTiposObras(this.tiposObras, newPuntosMapa.data);
              this.tiposObras = conteo;
              this.mostrarPuntosObra(newPuntosMapa);
            } else {
              if (this.obrasMarksLayer) {
                this.map.removeLayer(this.obrasMarksLayer);
              }
              this.mensaje.messageWarning('Filtro sin resultados');
            }
          },
          error: (err: unknown) => {
            console.warn(err);
            this.mensaje.showMessage(err);
          }
        });
      } else {
        this.filtrarLocal();
      }
    } else {
      if (this.periodoSeleccionado.descripcion === 'Todos') {
        if (this.periodo !== this.periodoSeleccionado.descripcion) {
          this.periodo = this.periodoSeleccionado.descripcion;
          this.loadPuntosObra();
        } else {
          this.filtrarLocal();
        }
      } else {
        this.filtrarLocal();
      }
    }
  }

  descargarReporte() {
    this.openModalPorMunicipioComponent();
  }

  public openModalPorMunicipioComponent() {
    const payload = {
      idMunicipio: this.municipioSeleccionado.id,
      ejercicio: this.periodoSeleccionado.descripcion !== 'Todos' ? parseInt(this.periodoSeleccionado.descripcion) : 0,
      estatus: this.estatusObrasSeleccionado.descripcion
    };
    const initialState = {
      params: payload,
      isModal: true,
      modalExtraOptions: {
        closeButton: true,
        closeButtonText: 'Cancelar',
        acceptButton: true,
        acceptButtonText: 'Aceptar'
      }
    };

    this.bsModalRef = this.bsModalService.show(ModalPorMunicipioComponent, {
      initialState,
      class: 'modal-primary modal-fullscreen',
      backdrop: 'static',
      keyboard: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  // descargarReporte() {
  //   const payload = {
  //     idMunicipio: this.municipioSeleccionado.id,
  //     ejercicio: this.periodoSeleccionado.descripcion !== 'Todos' ? parseInt(this.periodoSeleccionado.descripcion) : 0,
  //     estatus: this.estatusObrasSeleccionado.descripcion
  //   };

  //   this.obrasService.getReporte(payload).subscribe({
  //     next: (response: Blob) => {
  //       const url = window.URL.createObjectURL(response);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'Reporte.pdf';
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     error: (err: unknown) => {
  //       this.mensaje.showMessage({
  //         notification: {
  //           mensajeUsuario: 'Ocurrio un error al intentar descargar el Reporte',
  //           severidad: 'error'
  //         }
  //       });
  //     }
  //   });
  // }

  public filtrarLocal() {
    const info = {
      tiposObras: this.tiposObras,
      puntosMapa: this.puntosMapa,
      idMunicipio: this.municipioSeleccionado.id,
      estatus: this.estatusObrasSeleccionado.descripcion
    };

    const newPuntosMapa = this.helperService.filtrarData(info);
    if (newPuntosMapa.data.length > 0) {
      const conteo = this.helperService.calcularConteoTiposObras(this.tiposObras, newPuntosMapa.data);
      this.tiposObras = conteo;
      this.montoInversion = newPuntosMapa.data.reduce((total, x) => total + x.montoInversion, 0);
      this.mostrarPuntosObra(newPuntosMapa);

      this.montoInversionActual = newPuntosMapa.data
        .filter((elemento) => parseInt(elemento.ejercicio) === this.annioActual)
        .reduce((suma, elemento) => suma + elemento.montoInversion, 0);

      this.calcularKms(newPuntosMapa.data);
    } else {
      if (this.obrasMarksLayer) {
        this.map.removeLayer(this.obrasMarksLayer);
      }
      this.mensaje.messageWarning('Filtro sin resultados');
    }
  }

  loadTotales() {
    this.catalogosService.getObrasTotales({ ejercicio: 0 }).subscribe({
      next: (response: any) => {
        this.totales = response.data;
        //this.montoInversion = this.totales.totalMontoInversion;
        this.cards = [
          {
            id: 1,
            cantidad: this.totales.totalNumeroContratos,
            descripcion: 'TOTAL DE CONTRATOS',
            imagen: 'contrato-icon.svg'
          },
          {
            id: 2,
            cantidad: this.totales.totalMuncipiosBeneficiados,
            descripcion: 'MUNICIPIOS BENEFICIADOS',
            imagen: 'municipios-icon.svg'
          },
          {
            id: 3,
            cantidad: this.totales.totalMontoInversion,
            descripcion: 'MONTO TOTAL EJERCIDO',
            imagen: 'montototal-icon.svg'
          }
        ];

        for (const periodo of response.data.totalMontoInversionEjerciciosAnteriores) {
          this.listaPeriodos.push({
            periodo: parseInt(periodo.ejercicio),
            label: `Inversion ${periodo.ejercicio}`,
            valor: periodo.totalMontoInversion,
            totales: periodo.totalMontoInversion,
            currency: true
          });
        }

        this.listaItems = [
          ...this.listaPeriodos.sort((a, b) => {
            return parseInt(b.periodo) - parseInt(a.periodo);
          }),
          ...this.listaCarreteras
        ];
      },
      error: (err: unknown) => {
        console.warn(err);
        this.mensaje.showMessage(err);
      }
    });
  }

  inicializarMapa() {
    const mapboxUrl =
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXJvbWVyb3Y4NCIsImEiOiJja3dud2cxcDkycGsyMm9xYm1md29kNWllIn0.8dhvfioKHvS7dL7Z32JrTA';

    const attribution =
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    // const openStretsUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // const openAttribution = '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

    const _grayscale = L.tileLayer(mapboxUrl, {
      tileSize: 512,
      zoomOffset: -1,
      id: 'mromerov84/ckwnx5mi53bld14lruvgvlfrd',
      attribution: attribution
    });
    const streets = L.tileLayer(mapboxUrl, {
      tileSize: 512,
      zoomOffset: -1,
      id: 'mromerov84/ckwnwi3ir16s315ohivuycsj8',
      attribution: attribution
    });

    this.map = L.map('map', {
      center: [25.092141890307722, -107.09195826646527],
      // center: [24.8049172, -108.4233141],
      // center: [29.0667, -110.967],
      zoom: 8,
      //minZoom: 7,
      //maxZoom: 20
      layers: [streets],
      zoomControl: false,
      scrollWheelZoom: false
      //layers: [openstreets]
    });

    new L.Control.Zoom({ position: 'topleft' }).addTo(this.map);
    // this.map.locate({ setView: true, maxZoom: 14 });
    // this.generateRandomMarkers(10, 'green');

    setTimeout(() => {
      this.configService.getGEOJson().subscribe((geoData) => {
        this.geoJsonFeatureMunicipios = geoData[0];
        this.geoJsonFeatureMunicipiosPuntos = geoData[1];
        this.geoJsonFeatureDistritos = geoData[2];
        this.geoJsonFeatureDistritosPuntos = geoData[3];
        this.geoJsonFeatureSecciones = geoData[4];

        this.visualizarMapa(this.geoJsonFeatureMunicipios);
        this.loadPuntosObra();
      });
    }, 300);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);
    // this.map.setView([24.8049172, -107.4233141], 16);
    // this.map.locate({ setView: true, maxZoom: 18 });
  }

  visualizarMapa(geoJsonData?, _opt?: string) {
    if (this.geoJson) {
      this.geoJson.clearLayers();
      // this.map.removeLayer(this.seccionMarkersLayer);
    }
    if (geoJsonData) {
      this.geoJson = L.geoJSON(geoJsonData, {
        // pointToLayer: (feature, latlng) => {
        //   const img = feature?.properties?.ganador?.partido?.nombre
        //     ? feature?.properties?.ganador?.partido?.nombre.toLowerCase() + '.png'
        //     : 'transparent.png';
        //   const icono = new this.LeafIcon({
        //     iconUrl: `assets/markers/partidos/${img}`
        //   });

        //   return L.marker(latlng, { icon: icono });
        // },
        style: (feature) => {
          let color = '';
          if (!feature.properties.color) {
            color = this.helperService.getColor(feature.properties?.ganador?.partido?.nombre, this.partidos);
          }
          return {
            weight: 1,
            opacity: 1,
            // color: '#9ec1f2',
            color: color || 'gray',
            dashArray: '3'
          };
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.nombrePartido) {
            // const component = this.viewContainerRef.createComponent(CardInformationComponent);
            // feature.properties.partidos = this.partidos;
            // component.setInput('properties', feature.properties);
            // layer.bindPopup(component.location.nativeElement);

            // Create element
            const popup = document.createElement('app-card-information');

            // Create the component and wire it up with the element
            const factory = this.componentFactoryResolver.resolveComponentFactory(CardInformationComponent);
            const popupComponentRef = factory.create(this.inj, [], popup);

            // Attach to the view so that the change detector knows to run
            this.applicationRef.attachView(popupComponentRef.hostView);

            // Set the message
            feature.properties.partidos = this.partidos;
            popupComponentRef.instance.properties = feature.properties;
            popupComponentRef.setInput('properties', feature.properties);

            layer.bindPopup(popup);
          }
        }
      }).addTo(this.map);
      this.localStorage.setItem('geojson', geoJsonData);
    }
    // TODO
    // this.map.on('zoomend', (context) => {
    //   console.warn(context, this.map.getZoom());
    // });
  }

  render() {
    const features = this.geoJsonFeatureMunicipios.features;
    features.forEach((element) => {
      switch (element.properties.name) {
        case 'CONCORDIA':
          element.properties.icono = 'pri';
          break;
        case 'AHOME':
          element.properties.icono = 'pan';
          break;
        case 'CULIACAN':
          element.properties.icono = 'morena';
          break;
      }
    });

    this.geoJson = L.geoJSON(this.geoJsonFeatureMunicipios, {
      pointToLayer: (feature, latlng) => {
        const img = feature.properties.icono ? feature.properties.icono + '.png' : 'green.svg';
        const icono = new this.LeafIcon({
          iconUrl: `assets/markers/${img}`
        });

        return L.marker(latlng, { icon: icono });
      },
      style: (feature) => {
        let color: string;
        switch (feature.properties.name) {
          case 'CONCORDIA':
            color = '#FF0000';
            break;
          case 'AHOME':
            color = '#FFFF00';
            break;
          case 'CULIACAN':
            color = '#FF00FF';
            break;
        }
        return {
          weight: 2,
          opacity: 1,
          color: feature?.properties?.color ? feature?.properties?.color : '#9ec1f2',
          dashArray: '3',
          fillOpacity: 0.5,
          fillColor: color
        };
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.popupContent);
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            if (typeof layer.setStyle === 'function') {
              layer.setStyle({
                weight: 2,
                color: '#666',
                dashArray: '3',
                fillOpacity: 0.3
              });

              layer.bringToFront();
              layer.openPopup();
              // layer.bindPopup(layer.feature.properties.name);
            }
          },
          mouseout: (e) => {
            this.geoJson.resetStyle(e.target);
            layer.closePopup();
          },
          click: (e) => {
            this.map.fitBounds(e.target.getBounds());
          }
        });
      }
    }).addTo(this.map);
  }

  // get color depending on population density value

  generateRandomMarkers(numMarkers: number, color?: string) {
    const randomPointInCity = (cityLat: number, cityLng: number, radius: number) => {
      const angle = Math.random() * 360;
      const distance = Math.random() * radius;
      const newLat = cityLat + distance * Math.cos(angle);
      const newLng = cityLng + distance * Math.sin(angle);
      return { lat: newLat, long: newLng };
    };

    // Crea un nuevo layer para los puntos
    this.seccionMarkersLayer = L.layerGroup().addTo(this.map);

    for (let i = 0; i < numMarkers; i++) {
      const randomPoint = randomPointInCity(24.8049172, -107.4233141, 0.05);
      // L.marker(randomPoint).addTo(this.map);
      const dynamicIcon = new this.LeafIcon({ iconUrl: `assets/markers/${color}.svg` });
      L.marker([randomPoint.lat, randomPoint.long], { icon: dynamicIcon })
        .addTo(this.seccionMarkersLayer)
        .on('click', (e) => {
          alert(e);
          //this.openModalComponent();
        });
    }
  }

  mostrarMarks(opcion: string) {
    switch (opcion) {
      case 'azul':
        this.generateRandomMarkers(10, 'azul');
        break;
      case 'rojo':
        this.generateRandomMarkers(10, 'rojo');
        break;
    }
  }

  // toggleSidebar() {
  //   this.sidebarOpen = !this.sidebarOpen;
  //   setTimeout(() => {
  //     this.map.invalidateSize();
  //   }, 200);
  // }

  // toggleASidebar() {
  //   this.asidebarOpen = !this.asidebarOpen;
  //   setTimeout(() => {
  //     this.map.invalidateSize();
  //   }, 200);
  // }

  onChangePuesto(_$event) {
    const params = {
      idPuesto: this.puestoSeleccionado.id,
      anio: this.periodoSeleccionado
    };
    this.catalogosService.getElecciones(params).subscribe({
      next: (response) => {
        if (response.data === null) {
          this.mensaje.showMessage({ notification: response.notification });
        }
        this.votosMunicipio = response?.data?.votosMunicipio || [];
        this.votosDistrito = response?.data?.votosDistrito || [];
        this.partidosSwitch.partidosDistritos = response.data.partidosDistritos;
        this.partidosSwitch.partidosMunicipios = response.data.partidosMunicipios;

        for (const element of this.partidosSwitch.partidosDistritos) {
          element.checked = true;
        }
        for (const element of this.partidosSwitch.partidosMunicipios) {
          element.checked = true;
        }
      },
      error: (err: unknown) => {
        console.warn(err);
      }
    });
    this.recargarInfo();
  }

  recargarInfo($event?) {
    this.municipioSeleccionado = this.municipios[0];
    this.periodoSeleccionado = this.periodos[0];
    this.estatusObrasSeleccionado = this.estatusObras[0];
    this.tiposObras.forEach((el) => {
      el.checked = true;
    });
    this.filtrar();
    // TODO BORRAR DEMAS ELEMENTOS
    // this.refreshMap();
  }

  refreshMap() {
    this.visualizarMapa(this.geoJsonFeatureMunicipios);
    setTimeout(() => {
      this.map.flyTo([24.8049172, -107.4233141], 8);
    }, 200);
  }

  onChangeMunicipio($event, municipio: Municipio) {
    // this.map.setView([this.municipioSeleccionado.latitud, this.municipioSeleccionado.longitud], this.zoom);
    if ($event.checked.length < this.municipios.length) {
      if (this.allMunicipios) {
        this.allMunicipios = false;
      }
    }

    if ($event.checked.length > 0) {
      this.helperService
        .getGeoJsonByGroup(
          'municipio',
          this.votosMunicipio,
          this.geoJsonFeatureMunicipios,
          this.geoJsonFeatureMunicipiosPuntos,
          $event.checked
        )
        .then((response) => {
          this.visualizarMapa(response);
          this.map.flyTo([municipio.latitud, municipio.longitud]);
        });
    } else if ($event.checked.length === 0) {
      this.geoJson.clearLayers();
    }
  }

  onChangeDistrito($event, _distrito: Distrito) {
    if ($event.checked.length < this.distritos.length) {
      if (this.allDistritos) {
        this.allDistritos = false;
      }
    }
    if ($event.checked.length > 0) {
      this.helperService
        .getGeoJsonByGroup(
          'distrito',
          this.votosDistrito,
          this.geoJsonFeatureDistritos,
          this.geoJsonFeatureDistritosPuntos,
          $event.checked
        )
        .then((response) => {
          let coord = [];

          response.features.forEach((element) => {
            if (element.geometry.type === 'Point') {
              coord = element.geometry.coordinates;
            }
          });

          this.visualizarMapa(response);
          this.map.flyTo([coord[1], coord[0]], 9.2);
        });
    } else {
      this.geoJson.clearLayers();
      //this.map.flyTo([municipio.latitud, municipio.longitud]);
    }
  }

  checkUncheckMunicipios() {
    if (this.allMunicipios) {
      this.municipiosSeleccionados = this.municipios.slice();

      this.helperService
        .getGeoJsonAll(
          'municipio',
          this.votosMunicipio,
          this.geoJsonFeatureMunicipios,
          this.geoJsonFeatureMunicipiosPuntos
        )
        .then((response) => {
          this.visualizarMapa(response);
        });
      this.distritosSeleccionados = [];
    } else {
      this.municipiosSeleccionados = [];
      this.quitarObrasLayer();
      this.refreshMap();
    }
    // this.municipios.forEach((element) => {
    //   element.selected = this.allMunicipios;
    // });
  }

  checkUncheckDistritos() {
    if (this.allDistritos) {
      this.distritosSeleccionados = this.distritos.slice();
      this.helperService
        .getGeoJsonAll('distrito', this.votosDistrito, this.geoJsonFeatureDistritos, this.geoJsonFeatureDistritosPuntos)
        .then((response) => {
          this.visualizarMapa(response);
        });
      this.municipiosSeleccionados = [];
    } else {
      this.distritosSeleccionados = [];
      this.quitarObrasLayer();
      this.refreshMap();
    }
  }

  checkDistritoSelected(distrito: Distrito) {
    return this.distritosSeleccionados.find((element) => {
      return element.id === distrito.id;
    });
  }

  mostrarSeccion($event) {
    if (!$event.value) {
      this.mostrarSecciones(this.distritoSeleccionado);
      return false;
    }

    this.helperService
      .getGeoJsonSeccion(
        this.seccionSeleccionada,
        this.votosSeccion,
        this.geoJsonFeatureSecciones,
        this.distritoSeleccionado,
        this.geoJsonFeatureDistritos
      )
      .then((response) => {
        let coord = [];

        response.features.forEach((element) => {
          if (element.geometry.type === 'Point') {
            coord = element.geometry.coordinates;
          }
        });

        this.visualizarMapa(response);
        // this.map.panTo([coord[1], coord[0]]);
        this.map.flyTo([coord[1], coord[0]], 9.2);
      });
  }

  mostrarSecciones(distrito: Distrito) {
    this.distritoSeleccionado = distrito;
    // console.warn(distrito);
    const params = {
      idPuesto: this.puestoSeleccionado.id,
      anio: this.periodoSeleccionado,
      idDistrito: distrito.id
    };
    this.blockUIList.start('Procesando...');
    this.catalogosService.getEleccionesSeccionesPorDistrito(params).subscribe({
      next: (response) => {
        this.votosSeccion = response.data.votosSeccion;
        this.partidosSwitch.partidosMunicipios = response.data.partidosMunicipios;

        this.helperService
          .getGeoJsonSecciones(distrito, this.votosSeccion, this.geoJsonFeatureSecciones, null)
          .then((response) => {
            this.blockUIList.stop();
            this.seccionesActuales = [];
            for (const element of this.votosSeccion) {
              this.seccionesActuales.push({ id: element.seccion.id, clave: element.seccion.clave });
            }
            this.labelSeccionesDistritos = `Secciones del Distrito ${distrito.id}`;

            this.visualizarMapa(response, 'seccion');
          });
      },
      error: (err: unknown) => {
        this.blockUIList.stop();
        console.warn(err);
      }
    });
  }

  panelMunicipios() {
    if (this.municipiosSeleccionados?.length > 0 || this.allMunicipios) {
      return false;
    }
    return true;
  }
  panelDistritos() {
    if (this.distritosSeleccionados?.length > 0 || this.allDistritos) {
      return false;
    }
    return true;
  }

  visualizarSwitches() {
    if (this.partidosSwitch && (this.allMunicipios || this.allDistritos)) {
      return true;
    }
    return false;
  }

  mostrarPuntosObra(info) {
    if (this.obrasMarksLayer) {
      this.map.removeLayer(this.obrasMarksLayer);
    }
    this.obrasMarksLayer = L.layerGroup().addTo(this.map);
    this.markObrasId = [];
    info.data.forEach((point) => {
      if (point.latitud && point.longitud) {
        const img = point.idTipoObraSocial;
        const icono = new this.LeafIcon({
          iconUrl: `assets/markers/obras/oo_${img}_m.svg`
        });
        // Create element
        const popup = document.createElement('app-card-information');

        // Create the component and wire it up with the element
        const factory = this.componentFactoryResolver.resolveComponentFactory(CardInformationComponent);
        const popupComponentRef = factory.create(this.inj, [], popup);

        // Attach to the view so that the change detector knows to run
        this.applicationRef.attachView(popupComponentRef.hostView);

        // Set the message
        popupComponentRef.instance.tipoCard = 'obras';
        popupComponentRef.setInput('tipoCard', 'obras');
        // popupComponentRef.instance.properties = point;
        // popupComponentRef.setInput('properties', point);

        const marker = L.marker([point.latitud, point.longitud], { icon: icono }).addTo(this.obrasMarksLayer);
        marker.on('click', (e) => {
          this.loadObraDetalle(marker, point.id, popupComponentRef, popup);
        });
        // L.marker([point.latitud, point.longitud], { icon: icono })
        //   .addTo(this.obrasMarksLayer)
        //   .on('click', (e) => {
        //     this.openModalComponent(point);
        //   });
        this.markObrasId.push({ id: point.id, marker, popupComponentRef, popup });
        marker.on('popupclose', (e) => {
          if (this.map.getZoom() > 8) {
            this.map.flyTo([point.latitud, point.longitud]);
          } else {
            this.map.flyTo([25.092141890307722, -107.09195826646527]);
          }
        });
      }
    });
  }

  loadObraDetalle(marker: any, idObra: number, popupComponentRef, popup) {
    this.obrasService.getObrasDatosById({ idObra: idObra }).subscribe({
      next: (response) => {
        if (response.data.evidencias.length > 0) {
          console.log('id', response.data);
        }

        popupComponentRef.instance.properties = marker;
        popupComponentRef.setInput('marker', marker);
        popupComponentRef.instance.properties = response.data;
        popupComponentRef.setInput('properties', response.data);

        setTimeout(() => {
          marker.on('popupopen', (e) => {
            const px = this.map.project(e.target._popup._latlng);
            px.y -= e.target._popup._container.clientHeight / 2;
            this.map.panTo(this.map.unproject(px), { animate: true });
          });
          marker.bindPopup(popup).openPopup();
        }, 100);
      },
      error: (err: unknown) => {
        this.mensaje.showMessage(err);
      }
    });
  }

  quitarObrasLayer() {
    if (this.obrasMarksLayer) {
      this.map.removeLayer(this.obrasMarksLayer);
    }
  }

  filtrarSecciones($event: any) {
    this.votosSeccionEspecial = $event.data.votosSeccion;
    this.partidosSwitch.partidosSecciones = $event.data.partidosSecciones;
    this.seccionesEspeciales = $event.secciones.split(',');

    this.helperService
      .getGeoJsonSeccionesEspeciales(
        this.seccionesEspeciales,
        this.votosSeccionEspecial,
        this.geoJsonFeatureSecciones,
        null
      )
      .then((response) => {
        this.blockUIList.stop();
        this.seccionesActuales = [];
        this.visualizarMapa(response, 'seccion');
      });
  }

  quitarSeccionesEspecialesLayer() {
    this.seccionesEspeciales = [];
    this.refreshMap();
  }

  loadingSeccionesEspeciales($event) {
    if ($event === 'loading') {
      this.blockUIList.start('Procesando...');
    }
  }

  // SECCION CONFIGURACION MODAL
  public openModalComponent(opciones?: any) {
    const initialState = {
      params: opciones ? opciones : {},
      isModal: true,
      modalExtraOptions: {
        closeButton: true,
        closeButtonText: 'Cancelar',
        acceptButton: true,
        acceptButtonText: 'Aceptar'
      }
    };

    this.bsModalRef = this.bsModalService.show(ObrasModalComponent, {
      initialState,
      class: 'modal-light modal-fullscreen',
      backdrop: 'static',
      keyboard: false,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.event.subscribe((res) => {
      console.warn(res);
    });

    this.bsModalService.onHide.subscribe((reason: string) => {});
  }

  onChangeTipoObra(obra: any) {
    this.filtrar();
  }

  activarElemento(index: number) {
    if (this.elementoActivo === index) {
      this.elementoActivo = -1;
    } else {
      this.elementoActivo = index;
    }
  }

  calcularKms(data) {
    let kmsCaminosyCarreteras = 0;
    let kmsRehabilitados = 0;
    let kmsPavimentados = 0;

    for (const punto of data) {
      kmsCaminosyCarreteras += parseInt(punto.kmsCaminosyCarreteras);
      kmsRehabilitados += parseInt(punto.kmsRehabilitados);
      kmsPavimentados += parseInt(punto.kmsPavimentados);
    }

    for (const list of this.listaItems) {
      switch (list.label) {
        case 'Caminos y Carreteras':
          list.totales = kmsCaminosyCarreteras;
          break;
        case 'KM Rehabilitados':
          list.totales = kmsRehabilitados;
          break;
        case 'KM Pavimentados':
          list.totales = kmsPavimentados;
          break;
      }
    }
  }
}
