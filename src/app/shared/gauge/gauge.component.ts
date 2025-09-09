import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent {
  @Input() value = 0;                 // 0–100
  @Input() label = 'Avance de obra';  // opcional
  @Input() progressColor = '#5A1321'; // vino
  @Input() baseColor = '#5C5C62';     // gris

get gaugeBackground(): string {
    const v = Math.max(0, Math.min(100, this.value));
    // 0% -> todo gris
    if (v <= 0) {
      return `conic-gradient(from 180deg, ${this.baseColor} 0 360deg)`;
    }
    // 100% -> todo del color de progreso
    if (v >= 100) {
      return `conic-gradient(from 180deg, ${this.progressColor} 0 360deg)`;
    }
    // Barrido solo sobre el semicírculo superior (0..180° desde la izquierda)
    const sweep = (v / 100) * 180;
    return `conic-gradient(
      from 180deg,
      ${this.progressColor} 0 ${sweep}deg,
      ${this.baseColor} ${sweep}deg 360deg
    )`;
  }

}
