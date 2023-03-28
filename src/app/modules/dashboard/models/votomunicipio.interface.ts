import { Municipio } from './municipio.interface';
import { Partido } from './partido.interface';
export interface VotoMunicipio {
  municipio?: Municipio;
  noRegistrados: number;
  nulos: number;
  listaNominal: number;
  votos: number;
  partidos: Partido[];
}
