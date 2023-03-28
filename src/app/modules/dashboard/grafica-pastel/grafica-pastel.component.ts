import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Distrito } from '../models/distrito.interface';
import { GraficaViewComponent } from './grafica-view/grafica-view.component';
import { Municipio } from '../models/municipio.interface';
import { Partido } from '../models/partido.interface';
import { Seccion } from '../models/seccion.interface';

@Component({
  selector: 'app-grafica-pastel',
  templateUrl: './grafica-pastel.component.html',
  styleUrls: ['./grafica-pastel.component.scss']
})
export class GraficaPastelComponent implements OnInit, OnChanges {
  @ViewChild(GraficaViewComponent) dChartComp: any;
  @Input() votosMunicipio? = [];
  @Input() votosDistrito? = [];
  @Input() votosSeccionEsp? = [];
  @Input() municipiosSeleccionados?: Municipio[] = [];
  @Input() distritosSeleccionados?: Distrito[] = [];
  @Input() seccionesEspecialesSeleccionados?: Seccion[] = [];
  @Input() municipios?: Municipio[] = [];
  @Input() partidos?: Partido[] = [];
  @Input() votosPartidosSeleccionado? = null;
  @Input() card?: boolean = false;
  doughnutCharts: any = [];

  sumaTotalVotos = 0;

  ngOnInit(): void {
    this.initializeMunicipioGlobalChart();
    this.initializeMunucipioChart();
    this.initializeDistritoChart();
    this.initializeVotosSeleccionados();
    this.initializeSeccionesEspecialesChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    if (
      changes['votosMunicipio'] ||
      changes['votosDistrito'] ||
      changes['votosSeccionEsp'] ||
      changes['municipiosSeleccionados'] ||
      changes['distritosSeleccionados'] ||
      changes['votosPartidosSeleccionado'] ||
      changes['seccionesEspecialesSeleccionados']
    ) {
      const barSeleccionado = this.doughnutCharts.find((dc) => dc.category === 'Partido Seleccionado');
      this.doughnutCharts = [];
      if (barSeleccionado) {
        this.doughnutCharts.push(barSeleccionado);
      }
      this.ngOnInit();
    }
  }

  initializeMunicipioGlobalChart() {
    if (this.votosMunicipio.length > 0 && this.doughnutCharts.length === 0) {
      let sumatotalvotos = 0;
      let totalListnominal = 0;
      const numbers = [];
      const labels = [];
      const colors = [];
      const images = [];
      const votosA = [];
      // console.log(this.votosMunicipio);
      this.votosMunicipio.forEach((votos) => {
        const ganador = votos.votosPartidos.find((mv) => mv.esGanador);
        sumatotalvotos += ganador.votos;
        totalListnominal += votos.listaNominal;
      });
      this.municipios.forEach((m) => {
        const MunicipioVotos = this.votosMunicipio.find((vm) => vm.municipio.id == m.id);
        const PartidoGanador = MunicipioVotos.votosPartidos.find((mv) => mv.esGanador);
        const votos = PartidoGanador.votos;
        const label = m.nombre;
        const color = this.partidos.find((p) => p.id == PartidoGanador.partido.id).color;
        const porcentaje = (votos / sumatotalvotos) * 100;

        numbers.push(Math.round(porcentaje));
        labels.push(label);
        colors.push(color);
        votosA.push(votos);
        images.push(`assets/markers/partidos/${PartidoGanador.partido.nombre.toLowerCase()}.png`);
      });

      this.doughnutCharts.push({
        category: 'Municipio Global',
        numbers: numbers,
        labels: labels,
        colors: colors,
        images: images,
        votos: votosA,
        participacionCiudadana: ((sumatotalvotos / totalListnominal) * 100).toFixed(2)
      });
    }
  }

  initializeMunucipioChart() {
    if (
      this.municipiosSeleccionados &&
      this.municipiosSeleccionados.length > 0 &&
      !this.doughnutCharts.find((dc) => dc.category === 'Municipios Seleccionados')
    ) {
      const partido: any = {};
      let sumatotalvotos = 0;
      let totalListnominal = 0;
      const numbers = [];
      const labels = [];
      const colors = [];
      const images = [];
      const votos = [];

      this.municipiosSeleccionados.forEach((m) => {
        const MunicipioVotos = this.votosMunicipio.find((vm) => vm.municipio.id == m.id);
        totalListnominal += MunicipioVotos.listaNominal;
        MunicipioVotos.votosPartidos.map((mv) => {
          partido[mv.partido.nombre] = partido[mv.partido.nombre]
            ? mv.votos + Number(partido[mv.partido.nombre])
            : mv.votos;
          return mv;
        });
      });

      for (const partidoNom in partido) {
        sumatotalvotos += partido[partidoNom];
      }

      for (const partidoNom in partido) {
        const color = this.partidos.find((p) => p.nombre == partidoNom).color;
        const porcentaje = (partido[partidoNom] / sumatotalvotos) * 100;
        numbers.push(Math.round(porcentaje));
        labels.push(partidoNom);
        colors.push(color);

        votos.push(partido[partidoNom]);
        images.push(`assets/markers/partidos/${partidoNom.toLowerCase()}.png`);
      }

      this.doughnutCharts.push({
        category: 'Municipios Seleccionados',
        numbers: numbers,
        labels: labels,
        colors: colors,
        images: images,
        votos: votos,
        participacionCiudadana: ((sumatotalvotos / totalListnominal) * 100).toFixed(2)
      });
    }
  }

  initializeDistritoChart() {
    if (
      this.distritosSeleccionados &&
      this.distritosSeleccionados.length > 0 &&
      !this.doughnutCharts.find((dc) => dc.category === 'Distritos Seleccionados')
    ) {
      const partido: any = {};
      let sumatotalvotos = 0;
      let totalListnominal = 0;
      const numbers = [];
      const labels = [];
      const colors = [];
      const images = [];
      const votos = [];

      this.distritosSeleccionados.forEach((m) => {
        const distritoVotos = this.votosDistrito.find((vm) => vm.distrito.id == m.id);
        totalListnominal += distritoVotos.listaNominal;
        distritoVotos.votosPartidos.map((mv) => {
          partido[mv.partido.nombre] = partido[mv.partido.nombre]
            ? mv.votos + Number(partido[mv.partido.nombre])
            : mv.votos;
          return mv;
        });
      });

      for (const partidoNom in partido) {
        sumatotalvotos += partido[partidoNom];
      }

      for (const partidoNom in partido) {
        const color = this.partidos.find((p) => p.nombre == partidoNom).color;
        const porcentaje = Number(((partido[partidoNom] / sumatotalvotos) * 100).toFixed(2));
        numbers.push(Math.round(porcentaje));
        labels.push(partidoNom);
        colors.push(color);
        votos.push(partido[partidoNom]);
        images.push(`assets/markers/partidos/${partidoNom.toLowerCase()}.png`);
      }

      this.doughnutCharts.push({
        category: 'Distritos Seleccionados',
        numbers: numbers,
        labels: labels,
        colors: colors,
        images: images,
        votos: votos,
        participacionCiudadana: ((sumatotalvotos / totalListnominal) * 100).toFixed(2)
      });
    }
  }

  initializeVotosSeleccionados() {
    if (this.votosPartidosSeleccionado && !this.doughnutCharts.find((dc) => dc.category === 'Partido Seleccionado')) {
      const partido: any = {};
      let sumatotalvotos = 0;
      const numbers = [];
      const labels = [];
      const colors = [];
      const images = [];
      const votos = [];

      this.votosPartidosSeleccionado.votosPartido.sort((p1, p2) =>
        p1.votos < p2.votos ? 1 : p1.votos > p2.votos ? -1 : 0
      );

      for (const vps of this.votosPartidosSeleccionado.votosPartido) {
        sumatotalvotos += vps['votos'];
      }
      this.votosPartidosSeleccionado.votosPartido.map((mv) => {
        partido[mv.partido.nombre] = partido[mv.partido.nombre]
          ? mv.votos + Number(partido[mv.partido.nombre])
          : mv.votos;
        const color = this.partidos.find((p) => p.nombre == mv.partido.nombre).color;
        const porcentaje = Number(((mv.votos / sumatotalvotos) * 100).toFixed(2));
        numbers.push(Math.round(porcentaje));
        labels.push(mv.candidato.nombre);
        colors.push(color);
        images.push(`assets/markers/partidos/${mv.partido.nombre.toLowerCase()}.png`);
        votos.push(mv.votos);
        return mv;
      });

      this.doughnutCharts.push({
        category: 'Partido Seleccionado',
        numbers: numbers,
        labels: labels,
        colors: colors,
        images: images,
        votos: votos,
        participacionCiudadana: (
          (this.votosPartidosSeleccionado.votos / this.votosPartidosSeleccionado.listaNominal) *
          100
        ).toFixed(2)
      });
    }
  }
  initializeSeccionesEspecialesChart() {
    if (
      this.seccionesEspecialesSeleccionados &&
      this.seccionesEspecialesSeleccionados.length > 0 &&
      !this.doughnutCharts.find((dc) => dc.category === 'Secciones Esp. Seleccionados')
    ) {
      const partido: any = {};
      let sumatotalvotos = 0;
      let totalListnominal = 0;
      const numbers = [];
      const labels = [];
      const colors = [];
      const images = [];
      const votos = [];

      this.seccionesEspecialesSeleccionados.forEach((m) => {
        const seccionVotos = this.votosSeccionEsp.find((vm) => vm.seccion.id == m);
        totalListnominal += seccionVotos.listaNominal;
        seccionVotos.votosPartidos.map((mv) => {
          partido[mv.partido.nombre] = partido[mv.partido.nombre]
            ? mv.votos + Number(partido[mv.partido.nombre])
            : mv.votos;
          return mv;
        });
      });

      for (const partidoNom in partido) {
        sumatotalvotos += partido[partidoNom];
      }

      for (const partidoNom in partido) {
        const color = this.partidos.find((p) => p.nombre == partidoNom).color;
        const porcentaje = Number(((partido[partidoNom] / sumatotalvotos) * 100).toFixed(2));
        numbers.push(Math.round(porcentaje));
        labels.push(partidoNom);
        colors.push(color);
        votos.push(partido[partidoNom]);
        images.push(`assets/markers/partidos/${partidoNom.toLowerCase()}.png`);
      }

      this.doughnutCharts.push({
        category: 'Seccion Especial Seleccionados',
        numbers: numbers,
        labels: labels,
        colors: colors,
        images: images,
        votos: votos,
        participacionCiudadana: ((sumatotalvotos / totalListnominal) * 100).toFixed(2)
      });
      this.sumaTotalVotos = sumatotalvotos;
    }
  }
}
