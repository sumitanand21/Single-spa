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
    selector: 'app-bubblechart',
    templateUrl: './bubblechart.component.html',
    styleUrls: ['./bubblechart.component.scss']
})
export class BubblechartComponent implements OnInit, OnDestroy {
    private chart: am4charts.XYChart;
    groupType = 'negative';
    @Input()
    set chartData(value) {
        if (value) {
            this.getBubblechartData(value);
        }
    }
    constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) { }

    ngOnInit() {
    }
    browserOnly(f: () => void) {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                f();
            });
        }
    }

    createChart(chartsDetails) {
        // Chart code goes in here
        this.browserOnly(() => {
            // Themes end
        });
        this.chart = am4core.create('chartdiv1', am4charts.XYChart);
        this.chart.data = chartsDetails;
        const valueAxisX = this.chart.xAxes.push(new am4charts.ValueAxis());
        valueAxisX.renderer.ticks.template.disabled = true;
        valueAxisX.renderer.axisFills.template.disabled = true;
        const valueAxisY = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisY.renderer.ticks.template.disabled = true;
        valueAxisY.renderer.axisFills.template.disabled = true;
        valueAxisY.title.text = 'Maximum';
        valueAxisX.title.text = 'Mean Correlation';
        valueAxisY.renderer.grid.template.disabled = true;
        valueAxisX.renderer.grid.template.disabled = true;
        let color = '#49698c';
        if (this.groupType === 'negative') {
            valueAxisX.min = -1.2;
            valueAxisX.strictMinMax = true;
            valueAxisX.max = 0;
            valueAxisY.strictMinMax = true;
            valueAxisY.min = -1.2;
            valueAxisY.max = 0;
            valueAxisY.renderer.inversed = true;
            valueAxisX.renderer.inversed = true;
            color = '#49698c';
        } else {
            valueAxisX.min = 0;
            valueAxisX.max = 1.2;
            valueAxisX.strictMinMax = true;
            valueAxisY.min = 0;
            valueAxisY.max = 1.2;
            valueAxisY.strictMinMax = true;
            valueAxisY.renderer.inversed = false;
            valueAxisX.renderer.inversed = false;
            color = '#b2d94b';
        }
        // valueAxisX.min = -100;
        // valueAxisX.max = 100;


        const series: any = this.chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = 'MeanCorrelation';
        series.dataFields.valueY = 'Maximum';
        series.dataFields.value = 'TotalGroupMembers';
        series.dataFields.groupName = 'GroupName';
        series.dataFields.median = 'Median';
        series.dataFields.standardDeviation = 'StandardDeviation';
        series.dataFields.minimum = 'Minimum';
        series.strokeOpacity = 0;
        series.sequencedInterpolation = true;
        series.tooltip.pointerOrientation = 'vertical';
        const bullet = series.bullets.push(new am4core.Circle());
        bullet.fill = am4core.color(color);
        // bullet.strokeOpacity = 0;
        bullet.strokeWidth = 2;
        bullet.fillOpacity = 0.5;
        bullet.stroke = am4core.color(color);
        bullet.hiddenState.properties.opacity = 0;
        // tslint:disable-next-line:max-line-length
        bullet.tooltipText = '[bold]{title}[/]\nGroupName: {groupName}\nTotalGroupMembers: {value.value}\nMeanCorrelation: {valueX.value}\nMaximum:{valueY.value}';
        const outline = this.chart.plotContainer.createChild(am4core.Circle);
        outline.fillOpacity = 0;
        outline.strokeOpacity = 0;
        outline.stroke = am4core.color(color);
        outline.strokeWidth = 0;
        outline.hide(0);

        const blurFilter = new am4core.BlurFilter();
        outline.filters.push(blurFilter);

        bullet.events.on('over', (event) => {
            const target = event.target;
            outline.radius = target.pixelRadius + 2;
            outline.x = target.pixelX;
            outline.y = target.pixelY;
            outline.show();
        });

        bullet.events.on('out', (event) => {
            outline.hide();
        });

        const hoverState = bullet.states.create('hover');
        hoverState.properties.fillOpacity = 1;
        hoverState.properties.strokeOpacity = 1;
        series.heatRules.push({
            target: bullet,
            property: 'radius',
            min: 2,
            max: 25
        });
        bullet.adapter.add('tooltipY', (tooltipY, target) => {
            return -target.radius;
        });

        this.chart.cursor = new am4charts.XYCursor();
        this.chart.cursor.behavior = 'zoomXY';
        this.chart.cursor.snapToSeries = series;

        // chart.scrollbarX = new am4core.Scrollbar();
        // chart.scrollbarY = new am4core.Scrollbar();
        // chart.cursor = new am4charts.XYCursor();
        // disabeling dotted grid lines
        this.chart.cursor.fullWidthLineX = true;
        this.chart.cursor.lineX.strokeWidth = 0;
        this.chart.cursor.lineX.fill = am4core.color('#8F3985');
        this.chart.cursor.lineX.fillOpacity = 0.1;
        this.chart.cursor.lineY.disabled = true;

    }
    ngOnDestroy() {
        if (this.chart) {
            this.chart.dispose();
        }
        //   am4core.options.autoDispose = true;
    }
    getBubblechartData(chartData) {
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
