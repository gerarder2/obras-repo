export interface DatosReportePorMunicipio {
  municipio: string;
  inversion: number;
  porcentajeInversion: number;
}

export interface ObraReporte {
  descripcionDependencia: string;
  siglas: string;
  objeto: string;
  montoInversion: number;
  municipal: number;
  estatal: number;
  federal: number;
  montoInversionAcumulada: number;
  descripcionContratista: string;
  porcentajeAvance: number;
  descripcionTipoObra: string;
  descripcionTipoInversion: string;
  nombreMunicipio: string;
  importePorPagar: number;
  direccion: string;
  alcanceObra: string;
  superficieConstruccion: number;
  longitud: string;
  latitud: string;
  unidadMedida: string;
}
