import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpaVerticleUnmountGuard } from './spa-verticle-unmount.guard';
import { SpaVerticleHostComponent } from './spa-verticle-host.component';
import { SpaHostInnerNavComponent } from './spa-host-inner-nav/spa-host-inner-nav.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [SpaVerticleUnmountGuard],
    component: SpaVerticleHostComponent
  },
];

@NgModule({
  declarations: [SpaVerticleHostComponent,
    SpaHostInnerNavComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule]
})
export class SpaVerticleHostModule {}


import { SpaHostV1UnmountGuard } from './../spa-host-v1/spa-host-v1-unmount.guard';
import { SpaHostV1Component } from './../spa-host-v1/spa-host-v1.component';
const routesv1: Routes = [
  {
    path: '',
    canDeactivate: [SpaHostV1UnmountGuard],
    component: SpaHostV1Component
  },
];

@NgModule({
  declarations: [SpaHostV1Component],
  imports: [CommonModule, RouterModule.forChild(routesv1), FormsModule]
})
export class SpaHostV1Module {}
