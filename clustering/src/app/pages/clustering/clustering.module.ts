import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusteringRoutingModule } from './clustering-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { RCAComponent } from './components/rca/rca.component';
import { ClusteringComponent } from './clustering.component';

import { ModelConfigViewComponent } from './dialogs/model-config-view/model-config-view.component';

import { ChartsModule, ThemeService } from 'ng2-charts';
import { CreateTableComponent } from './components/create-table/create-table.component';
import { GenericTableModule } from 'src/app/libs/generic-table/generic-table.module';

import { DataPreviewComponent } from './dialogs/data-preview/data-preview.component';
import { UpsertRcaDetailsComponent } from './dialogs/upsert-rca-details/upsert-rca-details.component';

@NgModule({
  declarations: [
    ClusteringComponent,
    RCAComponent,
    ModelConfigViewComponent,
    DataPreviewComponent,
    UpsertRcaDetailsComponent,
    CreateTableComponent
  ],
  imports: [
    CommonModule,
    ClusteringRoutingModule,
    SharedModule,
    ChartsModule,
    GenericTableModule
  ],
  providers: [ThemeService],
  entryComponents: [
    ModelConfigViewComponent,
    DataPreviewComponent,
    UpsertRcaDetailsComponent]
})
export class ClusteringModule { }
