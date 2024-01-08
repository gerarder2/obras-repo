import * as turf from '@turf/turf';

import { Distrito } from '../modules/dashboard/models/distrito.interface';
import { GeoJson } from '../modules/dashboard/models/geojson.interface';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './../services/local-storage.service';
import { Municipio } from './../modules/dashboard/models/municipio.interface';
import { Obra } from '../modules/dashboard/models/obra.interface';
import { Partido } from '../modules/dashboard/models/partido.interface';
import { Seccion } from '../modules/dashboard/models/seccion.interface';
import { TipoObra } from './../modules/dashboard/models/tipoobra.interface';
import { VotoDistrito } from './../modules/dashboard/models/votodistrito.interface';
import { VotoMunicipio } from './../modules/dashboard/models/votomunicipio.interface';
import { VotoSeccion } from './../modules/dashboard/models/votoseccion.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private idObraSeleccionada = new BehaviorSubject<string>(null);
  private info: any;
  private closePopupEvent = new BehaviorSubject<string>(null);

  private tipoObrasUI = [
    {
      idTipoObraSocial: 1,
      icon: 'fas fa-landmark',
      color: 'green'
    },
    {
      idTipoObraSocial: 2,
      icon: 'fas fa-city',
      color: 'wine'
    },
    {
      idTipoObraSocial: 3,
      icon: 'fas fa-bus',
      color: 'gray-800'
    },
    {
      idTipoObraSocial: 4,
      icon: 'fas fa-hand-holding-droplet',
      color: 'turquesa'
    },
    {
      idTipoObraSocial: 5,
      icon: 'fas fa-handshake-angle',
      color: 'gold'
    },
    {
      idTipoObraSocial: 6,
      icon: 'fas fa-bridge-water',
      color: 'gray-300'
    }
  ];

  constructor(private localStorageService: LocalStorageService) {
    this.info = {};
  }

  public getGeoJsonByGroup(
    opcion: string,
    votos: VotoMunicipio[] | VotoDistrito[],
    geoJsonPoligonos: GeoJson,
    geoJsonPuntos: GeoJson,
    grupo: Municipio[] | Distrito[]
  ): Promise<any> {
    return new Promise((resolve, _reject) => {
      const temp_votos = JSON.parse(JSON.stringify(votos));
      const temp_grupo = JSON.parse(JSON.stringify(grupo));
      const temp_geoJsonPoligonos = JSON.parse(JSON.stringify(geoJsonPoligonos));
      const temp_geoJsonPuntos = JSON.parse(JSON.stringify(geoJsonPuntos));

      const filteredVotos = temp_votos.filter((objA) => temp_grupo.some((objB) => objB.id === objA[opcion].id));

      const temp_appendData = this.appendData(opcion, filteredVotos, temp_geoJsonPoligonos, temp_geoJsonPuntos);

      const filteredData = temp_appendData.features.filter((elemA) =>
        temp_grupo.some((elemB) => elemB.id === elemA.properties.id)
      );

      const newGeoJson = {
        type: 'FeatureCollection',
        features: []
      };
      newGeoJson.features = [...filteredData];

      resolve(newGeoJson);
    });
  }

  public getGeoJsonSeccion(
    seccion: Seccion,
    votos: VotoSeccion[],
    geoJsonPoligonos: GeoJson,
    distritos: Distrito,
    geoJsonPoligonosDistrito?: GeoJson
  ): Promise<any> {
    return new Promise((resolve, _reject) => {
      const temp_votos = JSON.parse(JSON.stringify(votos));
      const temp_geoJsonPoligonos = JSON.parse(JSON.stringify(geoJsonPoligonos));
      const temp_geoJsonPoligonosDistritos = JSON.parse(JSON.stringify(geoJsonPoligonosDistrito));

      const filteredVotos = temp_votos.filter((objA) => objA.seccion.clave === seccion.clave);

      const temp_appendData = this.appendDataSeccion(filteredVotos, temp_geoJsonPoligonos);

      const filteredData = temp_appendData.features.filter((elemA) => elemA.properties.SECCION === seccion.clave);

      const filteredDistritos = temp_geoJsonPoligonosDistritos.features.filter(
        (objA) => objA.properties.id === distritos.id
      );

      for (const element of filteredDistritos) {
        element.properties.color = 'gray';
      }

      const newGeoJson = {
        type: 'FeatureCollection',
        features: [...filteredDistritos]
      };
      newGeoJson.features = [...newGeoJson.features, ...filteredData];

      resolve(newGeoJson);
    });
  }

  public async getGeoJsonSecciones(
    distrito: Distrito,
    votos: VotoSeccion[],
    geoJsonPoligonos: GeoJson,
    geoJsonPuntos?: GeoJson
  ): Promise<any> {
    return new Promise((resolve, _reject) => {
      const temp_geoJsonPoligonos = JSON.parse(JSON.stringify(geoJsonPoligonos));
      const filteredObjects = temp_geoJsonPoligonos.features.filter(
        (element) => element.properties.DISTRITO == distrito.id
      );

      const temp_votos = [...votos];
      const new_geoJsonPoligonos = {
        type: 'FeatureCollection',
        features: [...filteredObjects]
      };
      const temp_geoJsonPuntos = JSON.parse(JSON.stringify(geoJsonPuntos));

      resolve(this.appendDataSeccion(temp_votos, new_geoJsonPoligonos, temp_geoJsonPuntos));
    });
  }

  public async getGeoJsonSeccionesEspeciales(
    seccionesEspeciales: Array<any>,
    votos: VotoSeccion[],
    geoJsonPoligonos: GeoJson,
    geoJsonPuntos?: GeoJson
  ): Promise<any> {
    return new Promise((resolve, _reject) => {
      const secciones = [];
      for (const seccion of seccionesEspeciales) {
        const temp_geoJsonPoligonos = JSON.parse(JSON.stringify(geoJsonPoligonos));
        // console.log(temp_geoJsonPoligonos.features);
        const filteredObjects = temp_geoJsonPoligonos.features.filter(
          (element) => element.properties.SECCION == seccion
        );
        for (const object of filteredObjects) {
          secciones.push(object);
        }
      }

      const temp_votos = [...votos];
      const new_geoJsonPoligonos = {
        type: 'FeatureCollection',
        features: [...secciones]
      };
      const temp_geoJsonPuntos = JSON.parse(JSON.stringify(geoJsonPuntos));

      resolve(this.appendDataSeccion(temp_votos, new_geoJsonPoligonos, temp_geoJsonPuntos));
    });
  }

  public async getGeoJsonAll(
    opcion: string,
    votos: VotoMunicipio[] | VotoDistrito[] | VotoSeccion[],
    geoJsonPoligonos: GeoJson,
    geoJsonPuntos?: GeoJson
  ): Promise<any> {
    return new Promise((resolve, _reject) => {
      const temp_votos = JSON.parse(JSON.stringify(votos));
      const temp_geoJsonPoligonos = JSON.parse(JSON.stringify(geoJsonPoligonos));

      const temp_geoJsonPuntos = JSON.parse(JSON.stringify(geoJsonPuntos));

      if (opcion !== 'seccion') {
        resolve(this.appendData(opcion, temp_votos, temp_geoJsonPoligonos, temp_geoJsonPuntos));
      } else {
        resolve(this.appendDataSeccion(temp_votos, temp_geoJsonPoligonos, temp_geoJsonPuntos));
      }
    });
  }

  public getColor(nombrePartido: string, partidos: Partido[]) {
    if (nombrePartido) {
      const temp_partidos = JSON.parse(JSON.stringify(partidos));
      const filteredObjects = temp_partidos.filter((obj) => obj.nombre === nombrePartido) || { color: '#9ec1f2' };
      return filteredObjects[0].color;
    } else {
      return 'gray';
    }
  }

  // public mostrarPartido(partido: Partido, geoJson: GeoJson) {}

  public ocultarPartido(partido: Partido, geoJson: GeoJson) {
    const filteredObjects = geoJson.features.filter((obj) => obj.properties.ganador.partido.id === partido.id);
    const invertedObjects = geoJson.features.filter((obj) => !filteredObjects.includes(obj));

    this.localStorageService.setItem(partido.id.toString(), filteredObjects);

    return {
      type: 'FeatureCollection',
      features: [...invertedObjects]
    };
  }

  public mostrarPartido(partido: Partido, geoJson: GeoJson) {
    const items = this.localStorageService.getItem(partido.id.toString());
    geoJson.features = [...geoJson.features, ...items];
    this.localStorageService.removeItem(partido.id.toString());
    return geoJson;
  }

  public mostrarSeccionesByDistrito(distrito: Distrito, geoJsonSecciones: GeoJson): Promise<any> {
    return new Promise((resolve, _reject) => {
      const filteredObjects = geoJsonSecciones.features.filter((element) => element.properties.DISTRITO == distrito.id);
      resolve({
        type: 'FeatureCollection',
        features: [...filteredObjects]
      });
    });
  }

  private appendData(opcion: string, temp_votos, temp_geoJsonPoligonos, temp_geoJsonPuntos?) {
    for (const element of temp_votos) {
      for (const element2 of temp_geoJsonPoligonos.features) {
        if (element[opcion].id === element2.properties.id) {
          element2.properties.noRegistrados = element.noRegistrados;
          element2.properties.nulos = element.nulos;
          element2.properties.listaNominal = element.listaNominal;
          element2.properties.votos = element.votos;
          let ganador;
          for (const item of element.votosPartidos) {
            if (item.esGanador) {
              ganador = item;
            }
          }
          element2.properties.ganador = ganador;
        }
      }
    }

    for (const element of temp_votos) {
      for (const element2 of temp_geoJsonPuntos.features) {
        if (element[opcion].id === element2.properties.id) {
          element2.properties.noRegistrados = element.noRegistrados;
          element2.properties.nulos = element.nulos;
          element2.properties.listaNominal = element.listaNominal;
          element2.properties.votos = element.votos;

          const ganador = element.votosPartidos.find((vp) => vp.esGanador);
          const candidatoDuplicado = element.votosPartidos.filter(
            (vp) => vp.candidato.nombre === ganador.candidato.nombre
          );

          let votos = 0;
          for (const candidato of candidatoDuplicado) {
            votos += candidato.votos;
          }

          element2.properties.ganador = ganador;
          element2.properties.nombrePartido = element[opcion].nombre
            ? element[opcion].nombre
            : 'Distrito ' + element[opcion].id;
          element2.properties.noRegistrados = element.noRegistrados;
          element2.properties.nulos = element.nulos;
          element2.properties.votosPartido = element.votosPartidos;
          element2.properties.listaNominal = element.listaNominal;
          element2.properties.imagenPartido = `assets/markers/partidos/${element2.properties.ganador.partido.nombre.toLowerCase()}.png`;
          element2.properties.votos = element.votos;
          element2.properties.votosContados = votos;
        }
      }
    }
    const responseGeojson = { ...temp_geoJsonPoligonos };
    responseGeojson.features = [...responseGeojson.features, ...temp_geoJsonPuntos.features];
    return responseGeojson;
  }

  private appendDataSeccion(temp_votos, temp_geoJsonPoligonos, _temp_geoJsonPuntos?) {
    const opcion = 'seccion';

    const features = [];
    for (const element of temp_geoJsonPoligonos.features) {
      const center = turf.centerOfMass(element.geometry);
      center.properties = element.properties;
      features.push(center);
    }

    for (const element of temp_votos) {
      for (const element2 of temp_geoJsonPoligonos.features) {
        if (element[opcion].clave === element2.properties.SECCION) {
          element2.properties.noRegistrados = element.noRegistrados;
          element2.properties.nulos = element.nulos;
          element2.properties.listaNominal = element.listaNominal;
          element2.properties.votos = element.votos;
          let ganador;
          for (const item of element.votosPartidos) {
            if (item.esGanador) {
              ganador = item;
            }
          }
          element2.properties.ganador = ganador;
        }
      }
    }

    for (const element of temp_votos) {
      for (const element2 of features) {
        // console.log('seccionmapa', element2.properties.SECCION, 'seccion', element[opcion].clave);
        if (element[opcion].clave == element2.properties.SECCION) {
          element2.properties.noRegistrados = element.noRegistrados;
          element2.properties.nulos = element.nulos;
          element2.properties.listaNominal = element.listaNominal;
          element2.properties.votos = element.votos;
          let ganador;
          for (const item of element.votosPartidos) {
            if (item.esGanador) {
              ganador = item;
            }
          }

          const candidatoDuplicado = element.votosPartidos.filter(
            (vp) => vp.candidato.nombre === ganador.candidato.nombre
          );

          let votos = 0;
          for (const candidato of candidatoDuplicado) {
            votos += candidato.votos;
          }

          element2.properties.ganador = ganador;
          element2.properties.nombrePartido = element[opcion].nombre
            ? element[opcion].nombre
            : 'Sección - ' + element[opcion].id;
          element2.properties.noRegistrados = element.noRegistrados;
          element2.properties.nulos = element.nulos;
          element2.properties.votosPartido = element.votosPartidos;
          element2.properties.listaNominal = element.listaNominal;
          if (element2?.properties?.ganador) {
            element2.properties.imagenPartido = `assets/markers/partidos/${element2.properties.ganador.partido.nombre.toLowerCase()}.png`;
          }
          element2.properties.votos = element.votos;
          element2.properties.votosContados = votos;
        }
      }
    }
    const responseGeojson = { ...temp_geoJsonPoligonos };
    responseGeojson.features = [...responseGeojson.features, ...features];
    return responseGeojson;
  }

  getMontosPorTiposObra(filtroTipoObras: string, tiposObra: any[], obras: Obra[]) {
    // console.log('getMontosPorTiposObra', tiposObra);
    const temp_tiposObra = [...tiposObra];
    const filtroIds = filtroTipoObras.split(',').map((x) => +x);

    const temp_array = [];

    for (const element of temp_tiposObra) {
      for (const item of element.data.tiposObra) {
        temp_array.push(item);
      }
    }

    const grupoTiposObra: { [key: string]: any }[] = temp_array
      .filter((objeto) => filtroIds.includes(objeto.id))
      .map((objeto) => {
        return {
          ...objeto,
          monto: 0,
          cantidad: 0
        };
      });

    for (const item of obras) {
      for (const el of grupoTiposObra) {
        if (item.idTipoObra === el['id']) {
          el['monto'] += parseFloat(item.montoInversion);
          el['cantidad']++;
        }
      }
    }

    return grupoTiposObra;
  }

  public getIconTipoObras(idTipoObraSocial: number) {
    return this.tipoObrasUI[idTipoObraSocial - 1];
  }

  public formatTipoObras(tiposObras: TipoObra[]) {
    for (const item of tiposObras) {
      item.conteo = 0;
      item.checked = true;
      switch (item['id']) {
        case 1:
          item.icon = 'fas fa-landmark';
          item.color = 'wine';
          break;
        case 2:
          item.icon = 'fas fa-city';
          item.color = 'green';
          break;
        case 3:
          item.icon = ' fas fa-bus';
          item.color = 'wine-100';
          break;
        case 4:
          item.icon = 'fas fa-hand-holding-droplet';
          item.color = 'gold';
          break;
        case 5:
          item.icon = 'fas fa-handshake-angle';
          item.color = 'blue';
          break;
        case 6:
          item.icon = 'fas fa-bridge-water';
          item.color = 'gray-800';
          break;
      }
    }
    return tiposObras;
  }
  public filtrarData(info) {
    const filtros = {
      idDependencia: info.idDependencia,
      idMunicipio: info.idMunicipio,
      estatus: info.estatus,
      idTipoObraSocial: []
    };
    // Obtener los tipos de obrasocial seleccionados
    info.tiposObras.forEach((element) => {
      if (element.checked) {
        filtros.idTipoObraSocial.push(element.id);
      }
    });
    const resultado = info.puntosMapa.data.filter((obra) => {
      if (filtros.idDependencia && obra.idDependencia !== filtros.idDependencia) {
        return false;
      }
      if (filtros.idMunicipio && obra.idMunicipio !== filtros.idMunicipio) {
        return false;
      }
      if (filtros.estatus !== 'TODAS' && obra.estatus !== filtros.estatus) {
        return false;
      }
      if (filtros.idTipoObraSocial.length > 0 && !filtros.idTipoObraSocial.includes(obra.idTipoObraSocial)) {
        return false;
      }
      if (filtros.idTipoObraSocial.length === 0) {
        return false;
      }
      return true;
    });
    return { data: resultado };
  }

  public calcularAvanceObra(obrasPorTipo: any[]) {
    const tabla1 = [];
    const sum = obrasPorTipo.reduce((accumulator, element) => {
      return accumulator + element.numeroObras;
    }, 0);

    obrasPorTipo.forEach((element, index) => {
      const avance = ((element.numeroObras / sum) * 100).toFixed(1);

      tabla1.push({
        id: index + 1,
        nombre: element.descripcionTipoObraSocial,
        progreso: parseFloat(avance),
        color: parseInt(avance) > 30 ? (parseInt(avance) > 60 ? 'green' : 'gold-500') : 'wine'
      });
    });

    return tabla1;
  }

  public calcularAvanceObraEjercicio(obrasPorEjercicio: any[]) {
    const tabla2 = [];
    const sum = obrasPorEjercicio.reduce((accumulator, element) => {
      return accumulator + element.numeroObras;
    }, 0);

    obrasPorEjercicio.forEach((element, index) => {
      const avance = ((element.numeroObras / sum) * 100).toFixed(1);

      tabla2.push({
        id: index + 1,
        nombre: element.ejercicio,
        progreso: parseFloat(avance),
        color: parseInt(avance) > 30 ? (parseInt(avance) > 60 ? 'green' : 'gold-500') : 'wine'
      });
    });

    return tabla2;
  }

  public calcularConteoTiposObras(tiposObras: TipoObra[], data: any[]) {
    tiposObras.forEach((objeto) => {
      const coincidencias = data?.filter((el) => el.idTipoObraSocial === objeto.id);
      objeto.conteo = coincidencias?.length;
    });
    return tiposObras;
  }

  calcularAvanceLicitacion(licitacionesPorOrganismo: any[]) {
    const tabla1 = [];
    const sum = licitacionesPorOrganismo.reduce((accumulator, element) => {
      return accumulator + element.numeroLicitaciones;
    }, 0);

    licitacionesPorOrganismo.forEach((element, index) => {
      const avance = Math.round((element.numeroLicitaciones / sum) * 100);

      tabla1.push({
        id: index + 1,
        nombre: element.descripcionDependencia,
        progreso: avance,
        color: avance > 30 ? (avance > 60 ? 'green' : 'gold-500') : 'wine'
      });
    });

    return tabla1;
  }
  calcularAvanceOrganismo(licitacionesPorOrganismo: any[]) {
    const tabla1 = [];
    const sum = licitacionesPorOrganismo.reduce((accumulator, element) => {
      return accumulator + element.numeroEventos;
    }, 0);

    licitacionesPorOrganismo.forEach((element, index) => {
      const avance = Math.round((element.numeroEventos / sum) * 100);

      tabla1.push({
        id: index + 1,
        nombre: element.descripcionDependencia,
        progreso: avance,
        color: avance > 30 ? (avance > 60 ? 'green' : 'gold-500') : 'wine'
      });
    });

    return tabla1;
  }

  setIdObraSeleccionada(valor: string) {
    this.idObraSeleccionada.next(valor);
  }

  getIdObraSeleccionada(): Observable<string> {
    return this.idObraSeleccionada.asObservable();
  }

  setClosePopup(valor: string, info: any) {
    this.info = info;
    this.closePopupEvent.next(valor);
  }

  getClosePopup(): Observable<string> {
    return this.closePopupEvent.asObservable();
  }

  getInfo() {
    return this.info;
  }
}
