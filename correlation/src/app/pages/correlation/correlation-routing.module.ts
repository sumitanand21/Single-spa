import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorrelationComponent } from './correlation.component';
import { UpsertFeatureGroupComponent } from './components/upsert-feature-group/upsert-feature-group.component';
import { HeatMapTabComponent } from './components/heat-map-tab/heat-map-tab.component';
import { TableViewTabComponent } from './components/table-view-tab/table-view-tab.component';
import { CorrelatedGroupsComponent } from './components/correlated-groups/correlated-groups.component';
import { AmchartsheatmapComponent } from './components/amchartsheatmap/amchartsheatmap.component';
import { PartionedchartComponent } from './components/partionedchart/partionedchart.component';
import { FeatureCorrelationComponent } from './components/feature-correlation/feature-correlation.component';
import { CorrelatedGroupsViewComponent } from './components/correlated-groups-view/correlated-groups-view.component';
import { DatelinechartComponent } from './components/datelinechart/datelinechart.component';
const routes: Routes = [
  { path: '', component: CorrelationComponent ,
  children: [
    { path: '', redirectTo: 'upsertfeature', pathMatch: 'full' },
    { path: 'upsertfeature', component: UpsertFeatureGroupComponent },
    { path: 'heatmap', component: HeatMapTabComponent },
    { path: 'tableview', component: TableViewTabComponent },
    { path: 'correlatedgroups', component: CorrelatedGroupsComponent },
    { path: 'partionedchart', component: PartionedchartComponent },
    { path: 'featurecorrelation', component: FeatureCorrelationComponent },
    { path: 'amchart', component: AmchartsheatmapComponent },
    { path: 'correlatedgroupsview', component: CorrelatedGroupsViewComponent },
    { path: 'dateline', component: DatelinechartComponent }
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrelationRoutingModule { }
