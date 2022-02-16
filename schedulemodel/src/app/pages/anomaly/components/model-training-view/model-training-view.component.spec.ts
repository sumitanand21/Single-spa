import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

// import { AmchartComponent } from './../amchart/amchart.component';
import { ModelTrainingViewComponent } from './model-training-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import {  MatDialog} from '@angular/material';
import { AnomalyService } from '../../services/anomaly.service';
import {  of } from 'rxjs';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { APP_BASE_HREF } from '@angular/common';
@Component({
  selector: 'app-amchart',
  template: ''
})
class MockAmchartComponent {
}
const routes: Routes = [

];
describe('ModelTrainingViewComponent', () => {
  let component: ModelTrainingViewComponent;
  let fixture: ComponentFixture<ModelTrainingViewComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let httpMock: HttpTestingController;
  let anomalyService: AnomalyService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelTrainingViewComponent,
        MockAmchartComponent ],
      imports: [RouterModule.forRoot(routes),
        HttpClientTestingModule,
        MaterialModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule
      ],
        providers: [
          {provide: ToastrService, useClass: ToastrService},
          { provide: Router, useValue: routerSpy },
          {provide: APP_BASE_HREF, useValue : '/' } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelTrainingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
    anomalyService = TestBed.get(AnomalyService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to anomaly all task', () => {
    const navigatePath = '/anomaly/alltask';
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith([navigatePath]);
  });
  it('should show training completed view', () => {
    anomalyService.AnomalyModelTrainingName = 'AM_1';
    anomalyService.AnomalyTaskName = 'Task_ABC';
    anomalyService.AnomalySelectedTrainingModel = {};
    const navigatePath = '/anomaly/alltask';
    component.ngOnInit();
    expect(component.taskCompleted).toBeTruthy();
  });

  it('should show training progress view', () => {
    anomalyService.AnomalyModelTrainingName = '';
    anomalyService.AnomalyTaskName = 'Task_ABC';
    const navigatePath = '/anomaly/alltask';
    component.ngOnInit();
    expect(component.taskCompleted).toBeFalsy();
  });

  it('should open model config dialog pop up', () => {
    const dialog = TestBed.get(MatDialog);
    spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(true)});
    component.openModelConfigDialog('OPRMAX');
    expect(true).toBeTruthy();
  });

  it('should open data preview dialog pop up', () => {
    const dialog = TestBed.get(MatDialog);
    spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(true)});
    component.openDataPreviewDialog();
    expect(true).toBeTruthy();
  });

});


