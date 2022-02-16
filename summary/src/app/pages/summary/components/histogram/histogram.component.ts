import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { BehaviorSubject } from 'rxjs';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;
  groupType = 'negative';
  xaxisSubject = new BehaviorSubject<any>(null);
  zoomIn = false;
  chunkSize = 500;
  filterData = [];
  chartBufferData = [];
  @Input()
  set chartData(value) {
    if (value) {
      this.getHistogramData(value);
    } else {
      if (this.chart) {
        this.chart.dispose();
      }
    }
  }
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone, private orderPipe: OrderPipe) { }

  ngOnInit() {
  }
  createChart(chartsDetails) {
    this.browserOnly(() => {
      // Themes end
    });
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    // Create axes
    // this.chart.data = chartsDetails;
    const categoryAxis: any = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'clusterId';
    categoryAxis.numberFormatter.numberFormat = '#.##';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.fill = am4core.color('#3B73B780');

    // categoryAxis.autoGridCount = true;
    // categoryAxis.minHorizontalGap = 100;
    categoryAxis.renderer.minGridDistance = 100;
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.fill = am4core.color('#3B73B780');
    categoryAxis.title.text = 'cluster name';
    valueAxis.title.text = 'No.of Alarm storms';

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
    series.dataFields.valueY = 'noOfEvents';
    series.dataFields.categoryX = 'clusterId';
    // tslint:disable-next-line:max-line-length
    series.tooltipText = '[bold]{title}[/]\ncluster name: {categoryX}\nNo.of Alarm storms: {valueY}';
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


    this.chart.zoomOutButton.events.on('hit', (ev) => {
      this.chart.zoomOutButton.hide();
      this.setData(this.chartBufferData);
    });

    categoryAxis.events.on('endchanged', (ev) => {
      if (this.chart.data.length >= this.chunkSize) {
        this.zoomIn = true;
        this.setVal(ev, categoryAxis);
        // this.xAxisChanged(ev);
      }
    });

    this.chart.events.on('datavalidated', (ev) => {
      if (this.zoomIn) {
        this.chart.zoomOutButton.appear();
        this.zoomIn = false;
      }
    });

    this.setData(this.chartBufferData);
  }

  xAxisChanged(ev) {
    this.zoomIn = true;
    this.xaxisSubject.next(ev);
  }

  setVal(ev, valueAxisX) {
    const axis = ev.target;
    let start: any = this.groupType === 'negative' ? axis.getPositionLabel(axis.end) : axis.getPositionLabel(axis.start);
    let end: any = this.groupType === 'negative' ? axis.getPositionLabel(axis.start) : axis.getPositionLabel(axis.end);
    start = +start.toString().replace(/,/g, '');
    end = +end.toString().replace(/,/g, '');
    console.log('New range: ', start + ' -- ' + end);
    const selectedArr = this.filterData.filter(it => it.clusterId >= start && it.clusterId <= end);
    if (selectedArr.length > 0) {
      this.setData(selectedArr);
    }
  }

  setData(selectedArr) {
    this.filterData = [...selectedArr];
    this.chart.data = this.largestTriangleThreeBuckets(selectedArr, this.chunkSize);
  }

  drawPoints(arrayObj) {
    const mainlength = arrayObj.length;
    if (mainlength > this.chunkSize) {
      const gapVal = Math.round(mainlength / this.chunkSize);
      const arrayOfPoints = [];

      for (let i = 0; i < mainlength; i += gapVal) {
        arrayOfPoints.push(arrayObj[i]);
        const j = i + gapVal;
        if (i < (mainlength - 1) && j > (mainlength - 1)) {
          arrayOfPoints.push(arrayObj[(mainlength - 1)]);
        }
      }
      return [...arrayOfPoints];
    } else {
      return [...arrayObj];
    }

  }

  largestTriangleThreeBuckets(data, threshold) {

    const dataLength = data.length;
    const floor = Math.floor;
    const abs = Math.abs;
    if (threshold >= dataLength || threshold === 0) {
      return data; // Nothing to do
    }

    const sampled = [];
    let sampledIndex = 0;

    // Bucket size. Leave room for start and end data points
    const every = (dataLength - 2) / (threshold - 2);

    let a = 0;
    let maxAreaPoint;
    let maxArea;
    let area;
    let nextA;

    sampled[sampledIndex++] = data[a]; // Always add the first point

    for (let i = 0; i < threshold - 2; i++) {

      // Calculate point average for next bucket (containing c)
      let avgX = 0;
      let avgY = 0;
      let avgRangeStart = floor((i + 1) * every) + 1;
      let avgRangeEnd = floor((i + 2) * every) + 1;
      avgRangeEnd = avgRangeEnd < dataLength ? avgRangeEnd : dataLength;

      const avgRangeLength = avgRangeEnd - avgRangeStart;

      for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
        avgX += data[avgRangeStart].clusterId * 1; // * 1 enforces Number (value may be Date)
        avgY += data[avgRangeStart].noOfEvents * 1;
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;

      // Get the range for this bucket
      let rangeOffs = floor((i + 0) * every) + 1;
      const rangeTo = floor((i + 1) * every) + 1;

      // Point a
      const pointAX = data[a].clusterId * 1; // enforce Number (value may be Date)
      const pointAY = data[a].noOfEvents * 1;

      maxArea = area = -1;

      for (; rangeOffs < rangeTo; rangeOffs++) {
        // Calculate triangle area over three buckets
        area = abs((pointAX - avgX) * (data[rangeOffs].noOfEvents - pointAY) -
          (pointAX - data[rangeOffs].clusterId) * (avgY - pointAY)
        ) * 0.5;
        if (area > maxArea) {
          maxArea = area;
          maxAreaPoint = data[rangeOffs];
          nextA = rangeOffs; // Next a is this b
        }
      }

      sampled[sampledIndex++] = maxAreaPoint; // Pick this point from the bucket
      a = nextA; // This a is the next a (chosen b)
    }

    sampled[sampledIndex++] = data[dataLength - 1]; // Always add last
    return sampled;
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

  createStaticData() {

    const dataArr = [];
    for (let i = 0; i < 100000; i++) {
      const obj = {
        clusterId: '-' + (i + 1),
        noOfEvents: Math.floor(Math.random() * (6 - (1) + 6)) + (1)
      };
      dataArr.push(Object.assign({}, obj));
    }

    return dataArr;

  }

  getHistogramData(chartData) {
    // chartData.chartArr = this.createStaticData();
    this.chartBufferData = this.orderPipe.transform(chartData.chartArr, 'clusterId', false);
    this.groupType = chartData.groupType;
    if (this.chart) {
      this.chart.dispose();
    }
    this.createChart([]);

  }

}
