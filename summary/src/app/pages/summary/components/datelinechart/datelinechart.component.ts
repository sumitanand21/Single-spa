import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { OrderPipe } from 'ngx-order-pipe';



@Component({
  selector: 'app-datelinechart',
  templateUrl: './datelinechart.component.html',
  styleUrls: ['./datelinechart.component.scss']
})
export class DatelinechartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  set chartData(value) {
    if (value) {
      this.getDateLineChart(value);
      // this.getHeatmapData(value);
    } else {
      if (this.chart) {
        this.chart.dispose();
      }
    }
  }
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone, private orderPipe: OrderPipe) {
  }
  private chart: am4charts.XYChart;
  dateSubject = new BehaviorSubject<any>(null);
  zoomIn = false;
  dategraph = false;
  chartBufferData = [];
  filterData = [];
  chunkSize = 2000;
  initial = true;
  @Input() chartId = 'dateChart';
  @Input() colorCode = '#E80B1C';

  ngOnInit() {
    this.dateSubject.pipe(debounceTime(100)).subscribe(value => {
      if (value) {
        this.setVal(value);
      }

      // http request can go here
    });
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
    // this.chart.data = this.chartBufferData;
    // this.chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
    // Create axes
    let dateAxis: any;
    if (this.dategraph) {
      dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.title.text = 'timestamp';
      dateAxis.groupData = true;
      dateAxis.groupCount = 1000;
    } else {
      dateAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
      dateAxis.title.text = 'timestamp';
      dateAxis.strictMinMax = true;
      dateAxis.groupData = true;
      dateAxis.groupCount = 1000;
    }
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;

    dateAxis.renderer.grid.template.stroke = am4core.color('#CBCBCB');
    dateAxis.renderer.grid.template.strokeOpacity = 1;
    dateAxis.renderer.grid.template.strokeWidth = 1;
    dateAxis.renderer.line.strokeOpacity = 1;
    dateAxis.renderer.line.stroke = am4core.color('#CBCBCB');
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.rotation = -25;
    dateAxis.renderer.labels.template.verticalCenter = 'top';
    dateAxis.renderer.labels.template.horizontalCenter = 'right';
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'No.of Alarms';
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
    // this.chart.zoomOutButton.isShowing = true;

    this.chart.cursor.fullWidthLineX = true;
    this.chart.cursor.lineX.strokeWidth = 0;
    this.chart.cursor.lineX.fillOpacity = 0.1;
    this.chart.cursor.lineY.disabled = true;

    // const zoomOutButton = buttonContainer.createChild(am4core.Button);
    this.chart.zoomOutButton.events.on('hit', (ev) => {
      this.chart.zoomOutButton.hide();
      this.setData(this.chartBufferData);
    });

    dateAxis.events.on('endchanged', (ev) => {
      if (this.chart.data.length >= this.chunkSize) {
        this.dateAxisChanged(ev);
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
        avgX += data[avgRangeStart].dateVal * 1; // * 1 enforces Number (value may be Date)
        avgY += data[avgRangeStart].featureVal * 1;
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;

      // Get the range for this bucket
      let rangeOffs = floor((i + 0) * every) + 1;
      const rangeTo = floor((i + 1) * every) + 1;

      // Point a
      const pointAX = data[a].dateVal * 1; // enforce Number (value may be Date)
      const pointAY = data[a].featureVal * 1;

      maxArea = area = -1;

      for (; rangeOffs < rangeTo; rangeOffs++) {
        // Calculate triangle area over three buckets
        area = abs((pointAX - avgX) * (data[rangeOffs].featureVal - pointAY) -
          (pointAX - data[rangeOffs].dateVal) * (avgY - pointAY)
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

  dateAxisChanged(ev) {
    this.zoomIn = true;
    // this.setVal(ev);
    this.dateSubject.next(ev);
  }

  setVal(ev) {
    const axis = ev.target;
    let start: any = this.dategraph ? new Date(axis.minZoomed) : axis.getPositionLabel(axis.start);
    let end: any = this.dategraph ? new Date(axis.maxZoomed) : axis.getPositionLabel(axis.end);
    if (!this.dategraph) {
      start = start.replace(/,/g, '');
      end = end.replace(/,/g, '');
    }
    console.log('New range: ', start + ' -- ' + end);
    // this.chart.xAxes[].zoomToValues(start , end);
    const selectedArr = this.filterData.filter(it => it.dateVal >= start && it.dateVal <= end);
    if (selectedArr.length > 0) {
      this.setData(selectedArr);
    }
  }
  setData(selectedArr) {
    this.filterData = [...selectedArr];
    // this.chart.data = this.drawPoints(selectedArr);
    this.chart.data = this.largestTriangleThreeBuckets(selectedArr, this.chunkSize);
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
    this.chartBufferData = this.orderPipe.transform(chartData.map((it, index) => {
      if (index === 0) {
        this.dategraph = it.dateVal ? true : false;
      }
      return Object.assign({ ...it, dateVal: this.dategraph ? this.getUTCDateObject(it.dateVal) : index });
    }), 'dateVal', false);

    // this.chartBufferData.sort((a, b) => a.dateVal - b.dateVal);

    if (this.chart) {
      this.chart.dispose();
    }
    if (this.initial === false) {
      this.creategraph();
    }
  }



}
