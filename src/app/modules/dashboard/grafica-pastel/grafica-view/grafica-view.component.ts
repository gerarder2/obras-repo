import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-grafica-view',
  templateUrl: './grafica-view.component.html',
  styleUrls: ['./grafica-view.component.scss']
})
export class GraficaViewComponent implements AfterViewInit {
  chart: any;
  @ViewChild('dChart', { static: false }) dChart: ElementRef;
  @Input() jsonArray: any = [25, 15, 20, 15, 30];
  @Input() chartLabels: any = ['label 1', 'label 2', 'label 3', 'label 4', 'label 5'];
  @Input() cutOut = 75;
  @Input() backgroundColors: any = ['#E15D44', '#55B4B0', '#DFCFBE', '#9B2335', '#5B5EA6'];

  ngAfterViewInit() {
    Chart.register(ChartDataLabels);
    const cvs = this.dChart.nativeElement;
    Chart.overrides['doughnut'].plugins.tooltip.enabled = true;
    Chart.overrides['doughnut'].plugins.legend.display = false;
    this.chart = new Chart(cvs, {
      type: 'doughnut',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.jsonArray,
            backgroundColor: this.backgroundColors,
            borderWidth: 0
          }
        ]
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        plugins: {
          datalabels: {
            display: false,
            offset: 2,
            anchor: 'end',
            align: 'top',
            color: '#0000000',
            formatter: function (value, ctx) {
              return `${value} %`;
            }
          }
        }
      }
    });
    /*this.chart = new Chart(cvs, {
        type: 'doughnut',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              data: this.jsonArray,
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
              backgroundColor: '#ccc',
              borderRadius: 3,
            },
          },
        },
      })*/
  }
}
