import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataManagementComponent } from './data-management.component';
import { DataSourceComponent } from './components/data-source/data-source.component';
import { DataPreviewDMComponent } from './components/data-preview-dm/data-preview-dm.component';
import { ConfigurationViewComponent } from './components/configuration-view/configuration-view.component';
import { UpsertConfigurationComponent } from './components/upsert-configuration/upsert-configuration.component';
import { UpsertDataSetComponent } from './components/upsert-data-set/upsert-data-set.component';
import { SystemNotificationComponent } from './components/system-notification/system-notification.component';
import { ServerConfigurationComponent } from './components/server-configuration/server-configuration.component';

const routes: Routes = [
  { path: '', component: DataManagementComponent ,
  children: [
    { path: '', redirectTo: 'datasource', pathMatch: 'full' },
    { path: 'datasource', component: DataSourceComponent},
    { path: 'upsertdatasource', component: UpsertDataSetComponent},
    { path: 'datapreviewdm', component: DataPreviewDMComponent },
    { path: 'configuration', component: ConfigurationViewComponent },
    { path: 'upsertconfiguration', component: UpsertConfigurationComponent },
    { path: 'notifications', component: SystemNotificationComponent },
    { path: 'serverconfiguration', component: ServerConfigurationComponent },
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }
