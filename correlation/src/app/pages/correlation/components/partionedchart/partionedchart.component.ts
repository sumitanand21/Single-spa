import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import { CorrelationService } from '../../services/correlation.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partionedchart',
  templateUrl: './partionedchart.component.html',
  styleUrls: ['./partionedchart.component.scss']
})

export class PartionedchartComponent implements OnInit, OnDestroy {
  private chart: any = am4charts.XYChart;
  negativeColor = '#49698c';
  positiveColor = '#b2d94b';

  @Input()
  set chartData(value) {
    if (value) {
      this.getPartionedData(value);
    }
  }

  categoryPixelHeight = 79;
  chartObjPixelHeight = 150;
  chartDetails = [];
  posHide = false;
  negHide = false;
  negValLength = 0;
  posValLength = 0;
  defaultVal = [{ key1: '', key2: 'negative', value: null },
  { key1: '', key2: 'positive', value: null }];
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) { }
  ngOnInit() {
    //  this.createChart();
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  createChart(chartsDetails, firstNeg, lastNeg, firstPos, lastPos) {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_material);
      // Themes end
      // Create chart instance
    });
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    this.chart.data = chartsDetails;
    // Add data
    // Create axes
    const yAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.renderer.grid.template.disabled = true;
    yAxis.dataFields.category = 'key1';
    yAxis.renderer.grid.template.location = 0;
    yAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.minGridDistance = 10;
    const ylabel = yAxis.renderer.labels.template;
    ylabel.wrap = true;
    ylabel.width = 200;
    const xAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.grid.template.disabled = true;
    xAxis.min = -1;
    xAxis.max = 1;
    // Create series
    const series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = 'value';
    series.dataFields.categoryY = 'key1';
    series.columns.template.tooltipText = '{categoryY}: [bold]{valueX}[/]';
    series.columns.template.strokeWidth = 0;
    const columnTemplate = series.columns.template;
    // columnTemplate.width = am4core.percent(100);
    columnTemplate.height = 20;
    // tslint:disable-next-line:only-arrow-functions
    series.columns.template.adapter.add('fill', (fill, target) => {
      if (target.dataItem) {
        switch (target.dataItem.dataContext.key2) {
          case 'negative':
            return am4core.color(this.negativeColor);
            break;
          case 'positive':
            return am4core.color(this.positiveColor);
            break;
        }
      }
      return fill;
    });
    const axisBreaks = {};
    const legendData = [];
    // Add ranges
    function addRange(label, start, end, color) {
      const range = yAxis.axisRanges.create();
      range.category = start;
      range.endCategory = end;
      range.label.text = label;
      range.label.disabled = true;
      range.label.fill = color;
      range.label.location = 0;
      range.label.dx = 0;
      range.label.dy = 8;
      range.label.fontWeight = 'bold';
      range.label.fontSize = 12;
      range.label.horizontalCenter = 'right';
      range.label.inside = false;
      range.label.marginLeft = -10;
      range.grid.stroke = am4core.color('#396478');
      range.grid.strokeOpacity = 1;
      range.tick.length = 200;
      range.tick.disabled = false;
      range.tick.strokeOpacity = 0.6;
      range.tick.stroke = am4core.color('#396478');
      range.tick.location = 0;
      range.locations.category = 1;
      const axisBreak = yAxis.axisBreaks.create();
      axisBreak.startCategory = start;
      axisBreak.endCategory = end;
      axisBreak.breakSize = 1;
      axisBreak.fillShape.disabled = true;
      axisBreak.startLine.disabled = true;
      axisBreak.endLine.disabled = true;
      axisBreaks[label] = axisBreak;
      legendData.push({ name: label, fill: color });
    }

    if (firstNeg) {
      addRange('Negative', lastNeg, firstNeg, am4core.color(this.negativeColor));
    }

    if (firstPos) {
      addRange('Positive', lastPos, firstPos, am4core.color(this.positiveColor));
    }

    this.chart.cursor = new am4charts.XYCursor();

    this.chart.cursor.xAxis = xAxis;
    this.chart.cursor.fullWidthLineX = true;
    this.chart.cursor.lineX.strokeWidth = 0;
    this.chart.cursor.lineX.fill = am4core.color('#8F3985');
    this.chart.cursor.lineX.fillOpacity = 0.1;
    this.chart.cursor.lineY.disabled = true;

    this.chart.cursor.yAxis = yAxis;
    this.chart.cursor.fullWidthLineY = true;
    this.chart.cursor.lineY.strokeWidth = 0;
    this.chart.cursor.lineY.fill = am4core.color('#8F3985');
    this.chart.cursor.lineY.fillOpacity = 0.1;
    this.chart.cursor.lineX.disabled = true;

    const legend = new am4charts.Legend();
    legend.position = 'right';
    legend.scrollable = true;
    legend.valign = 'top';
    legend.reverseOrder = true;
    this.chart.legend = legend;
    legend.data = legendData;
    // tslint:disable-next-line:only-arrow-functions
    legend.itemContainers.template.events.on('toggled', (event) => {
      // tslint:disable-next-line:no-string-literal
      const name = event.target.dataItem.dataContext['name'];
      const namelow = name.toLowerCase();
      const prevClickVal = event.target.isActive;
      const axisBreak = axisBreaks[name];
      if (event.target.isActive) {
        axisBreak.animate({ property: 'breakSize', to: 0 }, 1000, am4core.ease.cubicOut);
        // tslint:disable-next-line:only-arrow-functions
        let countLabel = 0;
        let countdata = 0;
        yAxis.dataItems.each((dataItem) => {
          if (dataItem.dataContext.key2 === namelow) {
            countLabel = countLabel + 1;
            dataItem.hide(1000, 500);
          }
        });
        // tslint:disable-next-line:only-arrow-functions
        series.dataItems.each(dataItem => {
          if (dataItem.dataContext.key2 === namelow) {
            countdata = countdata + 1;
            dataItem.hide(1000, 0, 0, ['valueX']);
          }
        });
      } else {
        axisBreak.animate({ property: 'breakSize', to: 1 }, 1000, am4core.ease.cubicOut);
        // tslint:disable-next-line:only-arrow-functions
        yAxis.dataItems.each((dataItem) => {
          if (dataItem.dataContext.key2 === namelow) {
            dataItem.show(1000);
          }
        });
        // tslint:disable-next-line:only-arrow-functions
        series.dataItems.each((dataItem) => {
          if (dataItem.dataContext.key2 === namelow) {
            dataItem.show(1000, 0, ['valueX']);
          }
        });
      }
      this.setHeight(event, namelow, prevClickVal);
    });

    // Set cell size in pixels
    const cellSize = 30;
    this.chart.events.on('datavalidated', (ev) => {
      // Get objects of interest
      const chartObj = ev.target;
      const categoryAxis = chartObj.yAxes.getIndex(0);
      this.categoryPixelHeight = categoryAxis.pixelHeight;
      this.chartObjPixelHeight = chartObj.pixelHeight;

      // Calculate how we need to adjust chart height
      const adjustHeight = chartObj.data.length * cellSize - categoryAxis.pixelHeight;

      // get current chart height
      const targetHeight = chartObj.pixelHeight + adjustHeight;

      // Set it on chart's container
      chartObj.svgContainer.htmlElement.style.height = targetHeight < 150 ? (150 + 'px') : (targetHeight + 'px');
    });
  }

  setHeight(ev, namelow, prevClickVal) {
    this.posHide = namelow === 'positive' ? prevClickVal : this.posHide;
    this.negHide = namelow === 'negative' ? prevClickVal : this.negHide;
    let negativeLength = 0;
    let positiveLength = 0;

    if (this.posHide) {
      positiveLength = this.posValLength > 0 ? 1 : 0;
    } else {
      positiveLength = this.posValLength;
    }

    if (this.negHide) {
      negativeLength = this.negValLength > 0 ? 1 : 0;
    } else {
      negativeLength = this.negValLength;
    }
    // Set cell size in pixels
    const cellSize = 30;
    const totallength = negativeLength + positiveLength;
    // Get objects of interest
    const chartObj = ev.target;
    // const categoryAxis = chartObj.yAxes.getIndex(0);
    // Calculate how we need to adjust chart height
    const adjustHeight = totallength * cellSize - this.categoryPixelHeight;

    // // get current chart height
    const targetHeight = this.chartObjPixelHeight + adjustHeight;

    // // Set it on chart's container
    chartObj.svgContainer.htmlElement.style.height = targetHeight < 150 ? (150 + 'px') : (targetHeight + 'px');
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    // chart: am4charts.XYChart;
    // Clean up chart when the component is removed
    if (this.chart) {
      this.chart.dispose();
      am4core.disposeAllCharts();
      am4core.options.autoDispose = true;
    }
    // this.maybeDisposeChart();
  }
  // maybeDisposeChart() {
  //   if (this.chart['chartdiv']) {
  //     this.chart['chartdiv'].dispose();
  //     delete this.chart['chartdiv'];
  //   }
  // }
  // ngOnInit(){
  //   this.getpartionedchartAPI();
  // }
  getPartionedData(chartData) {
    this.posHide = false;
    this.negHide = false;
    this.negValLength = chartData.negValLength;
    this.posValLength = chartData.posValLength;
    const chartDetails = [...chartData.negArrList, ...chartData.posArrList];

    this.createChart(chartDetails, chartData.firstNeg, chartData.lastNeg, chartData.firstPos, chartData.lastPos);
    // this.createChart(chartData ? chartData : []);
  }

}
