import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { CorrelationService } from '../../services/correlation.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;
  groupType = 'negative';
  @Input()
  set chartData(value) {
    if (value) {
      this.getHistogramData(value);
    }
  }
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) { }

  ngOnInit() {
  }
    createChart(chartsDetails) {
    this.browserOnly(() => {
      // Themes end
    });
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    // Create axes
    this.chart.data = chartsDetails;
    const categoryAxis: any = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'MeanCorrelation';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.fill = am4core.color('#3B73B780');

    // categoryAxis.autoGridCount = true;
    // categoryAxis.minHorizontalGap = 100;
    categoryAxis.renderer.minGridDistance = 100;
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.fill = am4core.color('#3B73B780');
    categoryAxis.title.text = 'Mean Correlation';
    valueAxis.title.text = 'Number Of Groups';

    // valueAxis.min = this.groupType === 'negative' ? -1 : 0;
    // valueAxis.max = this.groupType === 'negative' ? 0 : 1;
    let color = '#49698c';
    if (this.groupType === 'negative') {
      // valueAxis.renderer.inversed = true;
      // categoryAxis.renderer.inversed = true;
      color = '#49698c';
  } else {
    // categoryAxis.renderer.inversed = false;
    // valueAxis.renderer.inversed = false;
    color = '#b2d94b';
  }

    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.stroke = am4core.color('#CBCBCB');

    categoryAxis.renderer.line.strokeOpacity = 1;
    categoryAxis.renderer.line.stroke = am4core.color('#CBCBCB');
    // Create series
    const series: any = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'NumberOfGroups';
    series.dataFields.categoryX = 'MeanCorrelation';
    series.name = 'NumberOfGroups';
    series.dataFields.value = 'TotalGroupMembers';
    series.dataFields.groupName = 'GroupName';
    series.dataFields.median = 'Median';
    series.dataFields.standardDeviation = 'StandardDeviation';
    series.dataFields.minimum = 'Minimum';
    // tslint:disable-next-line:max-line-length
    series.tooltipText = '[bold]{title}[/]\nMeanCorrelation: {categoryX}\nNumberOfGroups: {valueY}';
    // series.columns.template.tooltipText = '[bold]{title}[/]\nGroupName: {groupName}\nTotalGroupMembers: {value.value}\nMeanCorrelation: {categoryX}\nMedian: {median}\nStandardDeviation: {standardDeviation}\nMinimum: {minimum}\nMaximum:{valueY}';
    series.columns.template.fillOpacity = .8;
    series.fill = am4core.color(color);

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 0;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.width = am4core.percent(10);

    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomXY';
    this.chart.cursor.snapToSeries = series.data;

    this.chart.cursor.fullWidthLineX = true;
    this.chart.cursor.lineX.strokeWidth = 0;
    this.chart.cursor.lineX.fill = am4core.color('#3B73B780');
    this.chart.cursor.lineX.fillOpacity = 0.1;
    this.chart.cursor.lineY.disabled = true;
  }
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }
  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  getHistogramData(chartData) {
    if (this.groupType === chartData.groupType) {
      if (this.chart) {
          this.chart.data = [...chartData.chartArr];
      } else {
          this.createChart(chartData.chartArr ? chartData.chartArr : []);
      }
  } else {
      this.groupType = chartData.groupType;
      if (this.chart) {
          this.chart.dispose();
      }
      this.createChart(chartData.chartArr ? chartData.chartArr : []);
  }

  }

}
