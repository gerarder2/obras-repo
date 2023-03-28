import { Distrito } from './distrito.interface';
import { Municipio } from './municipio.interface';
import { Partido } from './partido.interface';
import { Seccion } from './seccion.interface';
export interface VotoSeccion {
  distrito?: Distrito;
  municipio?: Municipio;
  noRegistrados?: number;
  nulos?: number;
  listaNominal?: number;
  votos?: number;
  partidos?: Partido[];
  seccion?: Seccion;
}
