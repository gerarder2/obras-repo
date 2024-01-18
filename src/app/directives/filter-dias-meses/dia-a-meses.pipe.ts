import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diasAMeses'
})
export class DiasAMesesPipe implements PipeTransform {
  transform(dias: string): string {
    const diasInt = parseInt(dias);
    if (diasInt < 32) {
      return `${dias} días`;
    } else {
      const meses = Math.floor(diasInt / 30);
      const diasRestantes = diasInt % 30;

      if (diasRestantes === 0) {
        return `${meses} mes${meses > 1 ? 'es' : ''}`;
      } else {
        return `${meses} mes${meses > 1 ? 'es' : ''} y ${diasRestantes} día${diasRestantes > 1 ? 's' : ''}`;
      }
    }
  }
}
