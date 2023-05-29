export interface Licitacion {
  id?: number;
  numero?: string;
  objeto?: string;
  fechaPublicacion?: Date;
  idTipoLicitacion?: number;
  descripcionTipoLicitacion?: string;
  idTipoNormativa?: number;
  descripcionTipoNormativa?: string;
  idObra?: number;
  objetoObra?: string;
  registradoPor?: number;
  nombreRegistradoPor?: string;
  fechaHoraRegistro?: Date;
  modificadoPor?: null;
  nombreModificadoPor?: null;
  fechaModificacion?: Date;
}
