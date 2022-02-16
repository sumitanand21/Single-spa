import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardListComponent } from './components/dashboard-list/dashboard-list.component';
import { AddOrEditDashboardModalComponent } from './dialogs/add-or-edit-dashboard-modal/add-or-edit-dashboard-modal.component';
@NgModule({
  declarations: [DashboardComponent, DashboardListComponent, AddOrEditDashboardModalComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
  entryComponents: [AddOrEditDashboardModalComponent]
})
export class DashboardModule { }
