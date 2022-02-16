import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, Input, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';
import { CorrelationService } from '../../services/correlation.service';

@Component({
  selector: 'app-amchartsheatmap',
  templateUrl: './amchartsheatmap.component.html',
  styleUrls: ['./amchartsheatmap.component.scss']
})
export class AmchartsheatmapComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;
  featuresx = [];
  featuresy = [];
  masterData = {};
  displayChunkList = [];

  yAxisFilter = [];
  yAxisAppliedFilter = [];
  searchYFeature = '';
  xAxisFilter = [];
  xAxisAppliedFilter = [];
  searchXFeature = '';

  totalPages = 1;

  // @ViewChild('pT', { static: true }) public pagination;
  defaultCurrentPage = 1;
  defaultItempg = 10;
  numberOfFeaturesPerPage = this.defaultItempg;
  currentPage = this.defaultCurrentPage;
  inputCurrentpage = this.defaultCurrentPage;
  pageArr = [10, 25, 50];

  @Input()
  set chartData(value) {
    if (value) {
      this.getHeatmapData(value);
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone, public correlationService: CorrelationService) { }

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

  createChart(chartsDetails) {
    if (this.chart) {
      this.chart.dispose();
    }
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_kelly);
    });
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    this.chart.maskBullets = false;
    this.chart.data = chartsDetails;
    this.chart.responsive.enabled = true;

    const xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    const yAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
    // yAxis.renderer.grid.template.disabled = true;

    xAxis.dataFields.category = 'column';
    yAxis.dataFields.category = 'rowsVal';
    xAxis.renderer.grid.template.strokeWidth = 0;
    xAxis.renderer.grid.template.disabled = true;
    const xlabel = xAxis.renderer.labels.template;
    xlabel.truncate = true;
    xlabel.maxWidth = 250;
    xlabel.tooltipText = '{column}';
    xlabel.tooltipX = 0;
    xlabel.fontSize = 12;
    xAxis.renderer.minGridDistance = 20;

    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;
    const ylabel = yAxis.renderer.labels.template;
    ylabel.truncate = true;
    ylabel.fontSize = 12;
    ylabel.maxWidth = 250;
    ylabel.tooltipText = '[bold]{rowsVal}[/]';
    yAxis.renderer.minGridDistance = 20;
    yAxis.tooltip.label.wrap = true;
    yAxis.tooltip.label.maxWidth = 180;
    yAxis.cursorTooltipEnabled = false;
    xAxis.renderer.labels.template.rotation = 90;
    // xAxis.cursorTooltipEnabled = false;

    const series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = 'column';
    series.dataFields.categoryY = 'rowsVal';
    series.dataFields.value = 'value';

    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;
    const bgColor = new am4core.InterfaceColorSet().getFor('background');

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 0;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.stroke = bgColor;
    columnTemplate.tooltipText = '[bold]{value}[/]';
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);
    columnTemplate.adapter.add('fill', (fill, target: any) => {
      if (target.dataItem) {
        if (target.dataItem.value == null || target.dataItem.value === undefined) {
          return am4core.color('#f3c300');
        }
      }
      return fill;
    });

    series.cursorTooltipEnabled = false;

    columnTemplate.adapter.add('tooltipText', (tooltipText, target: any) => {
      if (target.dataItem.value == null || target.dataItem.value === undefined) {
        return 'Null';
      } else {
        return tooltipText;
      }
    });

    columnTemplate.showTooltipOn = 'hover';


    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: am4core.color('#49698c'),
      max: am4core.color('#b2d94b'),
      minValue: -1,
      maxValue: 1
    });

    // heat legend
    const heatLegend = this.chart.rightAxesContainer.createChild(am4charts.HeatLegend);
    heatLegend.orientation = 'vertical';
    heatLegend.series = series;
    heatLegend.width = 40;
    heatLegend.height = am4core.percent(100);
    heatLegend.marginLeft = 20;
    heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
    heatLegend.valueAxis.renderer.minGridDistance = 20;
    heatLegend.minValue = -1;
    heatLegend.maxValue = 1;
    // heatLegend.valueAxis.renderer.grid.template.disabled = true;

    // heat legend behavior
    // tslint:disable-next-line:only-arrow-functions
    series.columns.template.events.on('over', function(event) {
      handleHover(event.target);
    });

    // tslint:disable-next-line:only-arrow-functions
    series.columns.template.events.on('hit', function(event) {
      handleHover(event.target);
    });

    function handleHover(column) {
      if (!isNaN(column.dataItem.value)) {
        heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
      } else {
        heatLegend.valueAxis.hideTooltip();
      }
    }

    // tslint:disable-next-line:only-arrow-functions
    series.columns.template.events.on('out', function(event) {
      heatLegend.valueAxis.hideTooltip();
    });

    // Zooming functionality
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomXY';
    // this.chart.cursor.xAxis = heatLegend.valueAxis;
    this.chart.cursor.snapToSeries = series.data;
    // this.chart.cursor.yAxis = heatLegend.valueAxis;


    // this.chart.cursor.xAxis = heatLegend.valueAxis;
    this.chart.cursor.fullWidthLineY = true;
    this.chart.cursor.lineY.strokeWidth = 0;
    this.chart.cursor.lineY.fill = am4core.color('#8F3985');
    this.chart.cursor.lineY.fillOpacity = 0.1;
    this.chart.cursor.lineX.strokeWidth = 0;
    this.chart.cursor.lineX.fill = am4core.color('#8F3985');
    this.chart.cursor.lineX.fillOpacity = 0.1;
    // this.chart.cursor.lineX.disabled = true;

  // for auto height 
  // let categoryAxis = this.chart.yAxes.getIndex(0);
  // let adjustHeight = this.chart.data.length * 33  - categoryAxis.pixelHeight;
  // let targetHeight = this.chart.pixelHeight + adjustHeight;
  // this.chart.svgContainer.htmlElement.style.height = targetHeight + "px";
  }


  ngOnDestroy() {
    // Clean up chart when the component is removed
    if (this.chart) {
      this.chart.dispose();
    }
  }

getHeatmapData(chartData) {
    if (this.chart) {
      this.chart.dispose();
    }
    this.xAxisFilter = [];
    this.xAxisAppliedFilter = [];
    this.yAxisFilter = [];
    this.yAxisAppliedFilter = [];
    this.numberOfFeaturesPerPage = this.defaultItempg;
    this.createChunkData(chartData ? chartData : []);
  }


  createChunkData(chartBufferArr) {
    this.featuresx = [];
    this.featuresy = [];
    this.masterData = {};

    chartBufferArr.forEach(element => {

      if (!this.featuresx.some(it => it === element.column)) {
        this.featuresx.push(element.column);
      }
      if (!this.featuresy.some(it => it === element.rowsVal)) {
        this.featuresy.push(element.rowsVal);
      }

      const temp = [];

      temp[element.rowsVal] = element.value;
      if (!this.masterData[element.column]) {
        this.masterData[element.column] = temp;

      } else {
        const existingxaxis = this.masterData[element.column];
        existingxaxis[element.rowsVal] = element.value;
      }
    });
    this.createChunkList();
  }

  createChunkList(): void {
    const xFeature = this.xAxisAppliedFilter.length ? this.xAxisAppliedFilter : this.featuresx;
    const yFeature = this.yAxisAppliedFilter.length ? this.yAxisAppliedFilter : this.featuresy;
    const xlength = xFeature.length;
    const ylength = yFeature.length;

    const list = [];
    for (let l = 0; l < xlength; l = l + this.numberOfFeaturesPerPage) {
      const temparrayx = xFeature.slice(l, l + this.numberOfFeaturesPerPage);
      for (let k = 0; k < ylength; k = k + this.numberOfFeaturesPerPage) {
        const temparrayy = yFeature.slice(k, k + this.numberOfFeaturesPerPage);
        list.push({ temparrayx, temparrayy });
        // list.push(this.getMatrixDataFor(temparrayx, temparrayy));
      }
    }

    this.displayChunkList = list;
    this.totalPages = this.displayChunkList.length;
    this.changePage(1);
  }

  getMatrixDataFor(x, y): any[] {
    const matrix = [];
    x.forEach(m => {
      y.forEach(n => {
        const xx = this.masterData[m];
        const obj = xx ? Object.keys(xx) : null;
        const val = obj && obj.includes(n) ? xx[n] : null;
        matrix.push({ rowsVal: n, column: m, value: val });
      });
    });

    return matrix;
  }

  onDropDownClose(feature, action?) {
    if (feature === 'X') {
      this.searchXFeature = '';
      if (action === 'apply') {
        this.xAxisAppliedFilter = [...this.xAxisFilter];
        this.createChunkList();
      } else if (action === 'clear') {
        this.xAxisFilter = [];
        this.xAxisAppliedFilter = [];
        this.createChunkList();
      } else {
        this.xAxisFilter = [...this.xAxisAppliedFilter];
      }
    } else {
      this.searchYFeature = '';
      if (action === 'apply') {
        this.yAxisAppliedFilter = [...this.yAxisFilter];
        this.createChunkList();
      } else if (action === 'clear') {
        this.yAxisFilter = [];
        this.yAxisAppliedFilter = [];
        this.createChunkList();
      } else {
        this.yAxisFilter = [...this.yAxisAppliedFilter];
      }
    }
  }



  changepageinp(inputVal) {
    if (inputVal > 0 && inputVal <= this.totalPages && inputVal !== this.currentPage) {
      this.currentPage = inputVal;
      this.changePage(this.currentPage);
    } else {
      this.inputCurrentpage = this.currentPage;
    }
  }

  setNewPageSize(pageSize) {
    this.numberOfFeaturesPerPage = pageSize;
    this.createChunkList();
  }

  changePage(newVal) {
    if (this.numberOfFeaturesPerPage === 50) {
      document.getElementById('chartdiv').style.height = '200%';
    } else {
      document.getElementById('chartdiv').style.height = '115%';
    }
    if (newVal > 0 && newVal <= this.totalPages) {
      this.inputCurrentpage = newVal;
      this.currentPage = newVal;

      const tempDispMatrix = this.getMatrixDataFor(this.displayChunkList[newVal - 1].temparrayx,
        this.displayChunkList[newVal - 1].temparrayy);
      this.createChart(tempDispMatrix);
    }
  }

}
