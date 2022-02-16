import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { CorrelationService } from '../../services/correlation.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-datelinechart',
  templateUrl: './datelinechart.component.html',
  styleUrls: ['./datelinechart.component.scss']
})
export class DatelinechartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;
  dategraph = false;
  chartBufferData = [];
  chunkArray = [];
  chunkSize = 5000;
  initial = true;
  @Input() chartId = 'dateChart';
  @Input() colorCode = '#E80B1C';
  @Input()
  set chartData(value) {
    if (value) {
      this.getDateLineChart(value);
      // this.getHeatmapData(value);
    }
  }
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {
  }
  ngOnInit() {

  }


  ngAfterViewInit() {
    if (this.initial === true) {
      if (document.getElementById(this.chartId)) {
        this.creategraph();
        this.initial = false;
      }
    }
  }
  creategraph() {
    this.chart = am4core.create(this.chartId, am4charts.XYChart);
    this.chart.data = this.chartBufferData;
    // this.chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
    // Create axes
    let dateAxis: any;
    if (this.dategraph) {
      dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.groupData = true;
      dateAxis.groupCount = 1000;
    } else {
      dateAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
      dateAxis.groupData = true;
      dateAxis.groupCount = 10000;
    }
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;

    dateAxis.renderer.grid.template.stroke = am4core.color('#CBCBCB');
    dateAxis.renderer.grid.template.strokeOpacity = 1;
    dateAxis.renderer.grid.template.strokeWidth = 1;
    dateAxis.title.text = 'Date';
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.stroke = am4core.color('#CBCBCB');
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.rotation = -55;
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Value';
    //  dateAxis.dateFormats.setKey("day", "MMM dd, yyyy");
        //  dateAxis.dateFormats.setKey("day", "MMM dd, yyyy");
    // dateAxis.baseInterval = {
    //   timeUnit: 'minute',
    //   count: 1
    // };
    valueAxis.renderer.grid.template.stroke = am4core.color('#CBCBCB');
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.grid.template.strokeWidth = 1;
    // Axis grid color
    valueAxis.renderer.axisFills.template.disabled = false;
    valueAxis.renderer.axisFills.template.fillOpacity = 0.5;
    valueAxis.renderer.axisFills.template.fill = am4core.color('#FFFFFF');
    valueAxis.fillRule = (dataItem) => {
      dataItem.axisFill.visible = true;
    };
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.stroke = am4core.color('#CBCBCB');
    valueAxis.renderer.minGridDistance = 20;
    // Create series
    const series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'featureVal';
    if (this.dategraph) {
      series.dataFields.dateX = 'dateVal';
    } else {
      series.dataFields.valueX = 'dateVal';
    }
    series.tooltipText = '{featureVal}';
    series.strokeWidth = 2;
    series.minBulletDistance = 15;
    series.fill = am4core.color(this.colorCode);
    series.stroke = am4core.color(this.colorCode);

    // Drop-shaped tooltips
    series.tooltip.pointerOrientation = 'vertical';
    series.cursorTooltipEnabled = false;
    // Make bullets grow on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    const bullethover = bullet.states.create('hover');
    if (this.dategraph) {
      bullet.tooltipText = 'X: {dateX.formatDate("dd MMM, yyyy HH:mm:ss")}, Y: {valueY}';
    } else {
      bullet.tooltipText = 'X: {valueX}, Y: {valueY}';
    }

    // dateAxis.keepSelection = true;
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomXY';
    this.chart.cursor.snapToSeries = series.data;

    this.chart.cursor.fullWidthLineX = true;
    this.chart.cursor.lineX.strokeWidth = 0;
    this.chart.cursor.lineX.fillOpacity = 0.1;
    this.chart.cursor.lineY.disabled = true;
 

    // this.setData();
  }

  setData() {
    // first 500
    this.chart.data = [];
    const j = this.chunkArray.length;
    for (let i = 0; i < j; i++) {
      this.chart.data.push(...this.chunkArray[i]);
    }
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

  getDateLineChart(chartData) {
    this.chartBufferData = chartData.map((it, index) => {
      if (index === 0) {
        this.dategraph = it.dateVal ? true : false;
      }
      return Object.assign({ ...it, dateVal: this.dategraph ? this.getUTCDateObject(it.dateVal) : index });
    });
    // this.chunkArray = [];
    // const k = this.chartBufferData.length;
    // for (let l = 0; l < k; l = l + this.chunkSize) {
    //   const temparray = this.chartBufferData.slice(l, l + this.chunkSize);
    //   // do whatever
    //   this.chunkArray.push(temparray);
    // }

    if (this.chart) {
      this.chart.dispose();
    }
    if (this.initial === false) {
        this.creategraph();
    }
  }
}
