import { Imagen } from './imagen.interface';

export interface Evidencia {
  id: number;
  descripcion: string;
  imagenes: Imagen[];
}
