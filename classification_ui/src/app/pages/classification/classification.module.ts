import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeatureGroupModule } from '../../libs/feature-group/feature-group.module';

import { ClassificationComponent } from '../classification/classification.component';
import { ProfilerComponent } from './components/profiler/profiler.component';
import { ClassificationRoutingModule } from './classification-routing.module';
import { ProfilerViewComponent } from './components/profiler-view/profiler-view.component';
import { ProfilerUpsertFeatureGroupComponent } from './components/profiler-upsert-feature-group/profiler-upsert-feature-group.component';
import { ProfilerHeaderComponent } from './components/profiler-header/profiler-header.component';



@NgModule({
  declarations: [
    ClassificationComponent,
    ProfilerComponent,
    ProfilerViewComponent,
    ProfilerUpsertFeatureGroupComponent,
    ProfilerHeaderComponent
  ],
  imports: [
    CommonModule,
    ClassificationRoutingModule,
    SharedModule,
    FeatureGroupModule
  ]
})
export class ClassificationModule { }
