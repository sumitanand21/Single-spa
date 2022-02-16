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
  selector: 'app-scatterplotter',
  templateUrl: './scatterplotter.component.html',
  styleUrls: ['./scatterplotter.component.scss']
})

export class ScatterplotterComponent implements OnInit, OnDestroy {

  private chart: am4charts.XYChart;
  chartBufferData = [];
  chunkArray = [];
  chunkSize = 5000;
  @Input()
  set chartData(value) {
    if (value) {
      this.getHeatmapDatas(value);
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {
  }
  ngOnInit() {
    //  this.createScatterchart();
  }
  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  //   createScatterchart(chartsDetails) {
  //     // Chart code goes in here
  //     this.browserOnly(() => {
  //       // Themes end
  //       });
  //       // Create chart instance
  //     this.chart = am4core.create('chartdiv', am4charts.XYChart);
  //     this.chart.data = chartsDetails;
  //     const xAxis: any = this.chart.xAxes.push(new am4charts.DateAxis());
  //     xAxis.dataFields.category = 'category';
  //     xAxis.title.text = 'X Axis';
  //     xAxis.renderer.grid.template.location = 0;
  //     xAxis.renderer.grid.template.disabled = true;
  //     const yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
  //     yAxis.renderer.grid.template.disabled = true;
  //     yAxis.title.text = 'Y Axis';
  //     const series1 = this.chart.series.push(new am4charts.LineSeries());
  //     series1.dataFields.valueY = 'column1';
  //     series1.dataFields.dateX = 'x';
  //     series1.strokeOpacity = 0;
  //     series1.cursorTooltipEnabled = false;
  //     const bullet1 = series1.bullets.push(new am4charts.CircleBullet());
  //     bullet1.tooltipText = 'X:{dateX}, Y:{valueY}';
  //     series1.tooltip.getFillFromObject = false;
  //     series1.tooltip.background.fill = am4core.color('#E80B1C');
  //     const arrow = bullet1.createChild(am4core.Circle);
  //     arrow.horizontalCenter = 'middle';
  //     arrow.verticalCenter = 'middle';
  //     arrow.strokeWidth = 0;
  //     arrow.fill = am4core.color('#E80B1C');
  //     arrow.width = 12;
  //     arrow.height = 12;
  //     series1.heatRules.push({
  //       target: bullet1.circle,
  //       min: 10,
  //       max: 60,
  //       property: 'radius'
  // });

  // // second series
  //     const series2 = this.chart.series.push(new am4charts.LineSeries());
  //     series2.dataFields.valueY = 'column2';
  //     series2.dataFields.dateX = 'x';
  //     series2.strokeOpacity = 0;
  //     series2.cursorTooltipEnabled = false;
  //     const bullet2 = series2.bullets.push(new am4charts.CircleBullet());
  //     bullet2.tooltipText = 'X:{dateX}, Y:{valueY}';
  //     series2.tooltip.getFillFromObject = false;
  //     series2.tooltip.background.fill = am4core.color('#3b73b7');
  //     const arrow2 = bullet2.createChild(am4core.Circle);
  //     arrow2.horizontalCenter = 'middle';
  //     arrow2.verticalCenter = 'middle';
  //     arrow2.strokeWidth = 0;
  //     arrow2.fill = am4core.color('#3b73b7');
  //     arrow2.width = 12;
  //     arrow2.height = 12;
  //     series2.heatRules.push({
  //       target: bullet2.circle,
  //       min: 10,
  //       max: 60,
  //       property: 'radius'
  // });

  // // Add scrollbars
  //     this.chart.cursor = new am4charts.XYCursor();
  //     this.chart.cursor.xAxis = xAxis;
  //     this.chart.cursor.fullWidthLineX = true;
  //     this.chart.cursor.lineX.strokeWidth = 0;
  //     this.chart.cursor.lineX.fill = am4core.color('#67b7dc');
  //     this.chart.cursor.lineX.fillOpacity = 0.1;
  //     this.chart.cursor.lineY.disabled = true;

  //     this.chart.cursor.yAxis = yAxis;
  //     this.chart.cursor.fullWidthLineY = true;
  //     this.chart.cursor.lineY.strokeWidth = 0;
  //     this.chart.cursor.lineY.fill = am4core.color('#67b7dc');
  //     this.chart.cursor.lineY.fillOpacity = 0.1;
  //     this.chart.cursor.lineX.disabled = true;

  //   }

  createScatterchart() {
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    // this.datelinechart = am4core.create('dateline2', am4charts.XYChart);
    // this.chart.data = [...chartsDetails];
    this.chart.dateFormatter.inputDateFormat = 'yyyy-MM';
    // this.datelinechart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
    // Create axes
    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    // dateAxis.renderer.labels.template.rotation = 30;

    dateAxis.renderer.grid.template.stroke = am4core.color('#CBCBCB');
    dateAxis.renderer.grid.template.strokeOpacity = 1;
    dateAxis.renderer.grid.template.strokeWidth = 1;
    dateAxis.groupData = true;
    dateAxis.groupCount = 1000;
    dateAxis.title.text = 'X Axis';
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.stroke = am4core.color('#CBCBCB');

    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Y Axis';
    //  dateAxis.dateFormats.setKey("day", "MMM dd, yyyy");
    // dateAxis.baseInterval = {
    //   timeUnit: 'minute',
    //   count: 1
    // };

    valueAxis.renderer.grid.template.stroke = am4core.color('#CBCBCB');
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.grid.template.strokeWidth = 1;
    valueAxis.renderer.minGridDistance = 50;
    // Axis grid color
    valueAxis.renderer.axisFills.template.disabled = false;
    valueAxis.renderer.axisFills.template.fillOpacity = 0.5;
    valueAxis.renderer.axisFills.template.fill = am4core.color('#FFFFFF');
    valueAxis.fillRule = (dataItem) => {
      dataItem.axisFill.visible = true;
    };
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.stroke = am4core.color('#CBCBCB');
    // Create series
    const series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'column1';
    series.dataFields.dateX = 'x';
    series.tooltipText = '{column1}';
    series.strokeWidth = 2;
    series.fill = am4core.color('#E80B1C');
    series.stroke = am4core.color('#E80B1C');

    // Drop-shaped tooltips
    series.tooltip.pointerOrientation = 'vertical';
    series.cursorTooltipEnabled = false;
    // Make bullets grow on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    const bullethover = bullet.states.create('hover');
    bullet.tooltipText = 'X: {dateX.formatDate("dd MMM, yyyy HH:mm:ss")}, Y: {valueY}';


    // Create series 2
    const series2 = this.chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = 'column2';
    series2.dataFields.dateX = 'x';
    series2.tooltipText = '{column1}';
    series2.strokeWidth = 2;
    series2.fill = am4core.color('#3B73B7');
    series2.stroke = am4core.color('#3B73B7');

    // Drop-shaped tooltips
    series2.tooltip.pointerOrientation = 'vertical';
    series2.cursorTooltipEnabled = false;
    // Make bullets grow on hover
    const bullet2 = series2.bullets.push(new am4charts.CircleBullet());
    const bullethover2 = bullet2.states.create('hover');
    bullet2.tooltipText = 'X: {dateX.formatDate("dd MMM, yyyy HH:mm:ss")}, Y: {valueY}';

    // dateAxis.keepSelection = true;
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomXY';
    this.chart.cursor.snapToSeries = series.data;

    this.chart.cursor.fullWidthLineX = true;
    this.chart.cursor.lineX.strokeWidth = 0;
    this.chart.cursor.lineX.fillOpacity = 0.1;
    this.chart.cursor.lineY.disabled = true;
    this.setData();
  }

  setData() {
    // first 500
    this.chart.data = [];
    const j = this.chunkArray.length;
    for (let i = 0; i < j; i++) {
      this.chart.data.push(...this.chunkArray[i]);
    }
  }

  ngOnDestroy() {
    // chart: am4charts.XYChart;
    // Clean up chart when the component is removed
    if (this.chart) {
      this.chart.dispose();
    }
    // this.maybeDisposeChart();
  }
  // maybeDisposeChart() {
  //   if (this.chart['chartdiv']) {
  //     this.chart['chartdiv'].dispose();
  //     delete this.chart['chartdiv'];
  //   }
  // }

  getUTCDateObject(dateStringUTC) {
    if (dateStringUTC) {
      try {
        const now = new Date(dateStringUTC);
        const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        return utc;
      } catch (error) {
        return null;
      }

    } else {
      return null;
    }
  }



  getHeatmapDatas(chartData) {
    this.chartBufferData = chartData.map((it) => Object.assign({ ...it, x: this.getUTCDateObject(it.x) }));
    this.chunkArray = [];
    const k = this.chartBufferData.length;
    for (let l = 0; l < k; l = l + this.chunkSize) {
      const temparray = this.chartBufferData.slice(l, l + this.chunkSize);
      // do whatever
      this.chunkArray.push(temparray);
    }
    if (this.chart) {
      this.chart.dispose();
    }
    this.createScatterchart();
  }
}
