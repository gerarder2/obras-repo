import { Imagen } from './imagen.interface';

export interface UltimaEvidencia {
  id?: number;
  nombre?: string;
  imagenes?: Imagen[];
  idEvidencia?: number;
  rutaPublica?: string;
}
