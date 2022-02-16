import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NwSnapshotRoutingModule } from './nwsnapshot-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NwSnapshotComponent } from './nwsnapshot.component';
import { ProfilerUpsertFeatureGroupComponent } from './components/profiler-upsert-feature-group/profiler-upsert-feature-group.component';
import { FeatureGroupModule } from 'src/app/libs/feature-group/feature-group.module';


@NgModule({
  declarations: [
    NwSnapshotComponent,
    ProfilerUpsertFeatureGroupComponent,
  ],
  imports: [
    CommonModule,
    NwSnapshotRoutingModule,
    SharedModule,
    FeatureGroupModule

  ],
  providers: [],
})
export class NwSnapshotModule { }
