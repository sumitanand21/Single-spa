import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';


@Component({
  selector: 'app-amchart',
  templateUrl: './amchart.component.html',
  styleUrls: ['./amchart.component.scss']
})
export class AmchartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  set graphData(value) {
    if (value) {
      this.setGraphData(value);
    }
  }
  private chart: am4charts.XYChart;
  graphDataDetails = [];
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }
  setGraphData(value) {
    if (value.length && value.length > 0) {
      this.graphDataDetails = value.map((val, i) => {
        return {
          key: i,
          value: val,
          valueDisp: val.toString()
        };
      });
      this.createGraph();
    }
  }
  createGraph() {
    this.browserOnly(() => {

      this.chart = am4core.create('chartdiv', am4charts.XYChart);

      this.chart.data = this.graphDataDetails;

      // Create axes
      // tslint:disable-next-line:prefer-const
      const indexAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
      indexAxis.renderer.minGridDistance = 20;
      indexAxis.renderer.labels.template.rotation = -55;
      const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minGridDistance = 20;
      // Create series
      // tslint:disable-next-line:prefer-const
      const series = this.chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.value = 'valueDisp';
      series.dataFields.valueX = 'key';
      series.strokeWidth = 2;

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = '{valueDisp}';
      bullet.strokeWidth = 2;
      bullet.stroke = am4core.color('#fff');
      bullet.circle.fill = series.stroke;
      const hoverState = bullet.states.create('hover');
      hoverState.properties.scale = 1.7;

      // Add cursor
      this.chart.cursor = new am4charts.XYCursor();
      this.chart.cursor.xAxis = indexAxis;
      this.chart.cursor.fullWidthLineY = true;
      this.chart.cursor.lineY.strokeWidth = 0;
      this.chart.cursor.lineY.fill = am4core.color('#8F3985');
      this.chart.cursor.lineY.fillOpacity = 0.1;
      this.chart.cursor.lineX.strokeWidth = 0;
      this.chart.cursor.lineX.fill = am4core.color('#8F3985');
      this.chart.cursor.lineX.fillOpacity = 0.1;
    });
  }
  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    if (this.chart) {
      this.chart.dispose();
    }
  }

  ngOnInit() {

  }
}
