export class EjecutaAccion {
  public execute(metodo: any, clase: any) {
    if (clase[metodo]) {
      clase[metodo]();
    }
  }
}
