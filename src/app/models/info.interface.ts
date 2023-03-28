export interface Info {
  message?: string;
  status?: number;
  error?: {
    notification: {
      mensajeUsuario?: string;
      tipoSeveridad?: number;
      severidad?: string;
    };
  };
  notification?: {
    mensajeUsuario?: string;
    tipoSeveridad?: number;
    severidad?: string;
  };
}
