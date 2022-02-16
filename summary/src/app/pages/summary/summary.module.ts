import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaticDashboardComponent } from './components/static-dashboard/static-dashboard.component';
import { DatelinechartComponent } from './components/datelinechart/datelinechart.component';
import { IframeDashboardComponent } from './components/iframe-dashboard/iframe-dashboard.component';
import { HistogramComponent } from './components/histogram/histogram.component';
import { RCAComponent } from './components/rca/rca.component';
import { DataPreviewComponent } from './dialogs/data-preview/data-preview.component';
import { ModelConfigViewComponent } from './dialogs/model-config-view/model-config-view.component';

@NgModule({
  declarations: [SummaryViewComponent,
    SummaryComponent,
    StaticDashboardComponent,
    DatelinechartComponent,
    HistogramComponent,
    IframeDashboardComponent,
    DataPreviewComponent,
    ModelConfigViewComponent,
    RCAComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SummaryRoutingModule,
    SharedModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  entryComponents: [DataPreviewComponent, ModelConfigViewComponent]
})
export class SummaryModule { }
