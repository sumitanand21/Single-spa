import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FeatureGroupModule } from '../../libs/feature-group/feature-group.module';

import { CorrelationRoutingModule } from './correlation-routing.module';
import { CorrelationComponent } from './correlation.component';

import { UpsertFeatureGroupComponent } from './components/upsert-feature-group/upsert-feature-group.component';
import { HeatMapTabComponent } from './components/heat-map-tab/heat-map-tab.component';
import { TableViewTabComponent } from './components/table-view-tab/table-view-tab.component';
import { CorrelatedGroupsComponent } from './components/correlated-groups/correlated-groups.component';

import { CorrelationHeaderComponent } from './components/correlation-header/correlation-header.component';

import { HeatmapComponent } from './components/heatmap/heatmap.component';
import { AmchartsheatmapComponent } from './components/amchartsheatmap/amchartsheatmap.component';
import { PartionedchartComponent } from './components/partionedchart/partionedchart.component';
import { ScatterplotterComponent } from './components/scatterplotter/scatterplotter.component';
import { FeatureCorrelationComponent } from './components/feature-correlation/feature-correlation.component';
import { CorrelatedGroupsViewComponent } from './components/correlated-groups-view/correlated-groups-view.component';
import { BubblechartComponent } from './components/bubblechart/bubblechart.component';
import { HistogramComponent } from './components/histogram/histogram.component';
import { DatelinechartComponent } from './components/datelinechart/datelinechart.component';
import { Datelinechart2Component } from './components/datelinechart2/datelinechart2.component';


@NgModule({
  declarations: [
    CorrelationComponent,
    UpsertFeatureGroupComponent,
    HeatMapTabComponent,
    TableViewTabComponent,
    CorrelatedGroupsComponent,
    CorrelationHeaderComponent,
    HeatmapComponent,
    AmchartsheatmapComponent,
    PartionedchartComponent,
    ScatterplotterComponent,
    FeatureCorrelationComponent,
    CorrelatedGroupsViewComponent,
    BubblechartComponent,
    HistogramComponent,
    DatelinechartComponent,
    Datelinechart2Component],
  imports: [
    CommonModule,
    CorrelationRoutingModule,
    SharedModule,
    FeatureGroupModule
  ],
  providers: [],
  entryComponents: []
})
export class CorrelationModule { }
