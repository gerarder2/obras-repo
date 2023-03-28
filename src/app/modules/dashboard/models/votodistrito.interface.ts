import { Distrito } from './distrito.interface';
import { Municipio } from './municipio.interface';
import { Partido } from './partido.interface';
export interface VotoDistrito {
  distrito?: Distrito;
  municipio?: Municipio;
  noRegistrados: number;
  nulos: number;
  listaNominal: number;
  votos: number;
  partidos: Partido[];
}
