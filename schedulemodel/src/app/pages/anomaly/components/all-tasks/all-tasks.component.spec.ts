import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllTasksComponent } from './all-tasks.component';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';
import { EmptyValueCheck } from 'src/app/pipes/modelName.pipe';
const routes: Routes = [

];
describe('AllTasksComponent', () => {
  let component: AllTasksComponent;
  let fixture: ComponentFixture<AllTasksComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  let httpMock: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTasksComponent, AlphaNumericDirective , EmptyValueCheck],
      imports: [RouterModule.forRoot(routes), HttpClientTestingModule,
        MaterialModule, FormsModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, NgxPaginationModule,
        FilterPipeModule,
        Ng2SearchPipeModule, OrderModule],
        providers: [DatePipe, EmptyValueCheck,
          {provide: ToastrService, useClass: ToastrService},
          { provide: Router, useValue: routerSpy },
          {provide: APP_BASE_HREF, useValue : '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
    component.taskScheDetails = {
      id: 'ddddddddddd',
      data: {
          modelType: 'MODELI',
          dataSet: 'All Data Sets',
          modelConfig: 'OPR_Pattern1',
          afterOcc: null,
          dataRangeValue: '48',
          dataRangeType: 'Hours'
      },
      job_type: 'ANOMALY',
      recur_on: 'INSTANTLY',
      schedule_day: '',
      schedule_from: '2020-12-01 4:11:00 UTC',
      schedule_name: 'Test sc',
      schedule_to: '2020-12-23 4:11:00 UTC',
      next_run_time: '2020-12-23 4:11:00 UTC'
  };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should change the page on search by Default', () => {
    component.onsearchChange('alltaskssearch', 'paginationId');
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
  });
  it('should change the page based on users input', () => {
    component.config.currentPage = 1;
    component.changepageinp(2, 5, 1);
    expect(component.config.currentPage).toBe(1);
    component.changepageinp(0, 5, 1);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
    component.changepageinp(10, 5, 1);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
  });
  it('should check the page that has changed', () => {
    component.changepage(0, 1);
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
  });
  it('should set the PageSize', () => {
    component.setNewPageSize(5, 1);
    expect(component.config.itemsPerPage).toBe(25);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
  });
  it('should Sort the table based on table header keys', () => {
    component.sortTask('name');
    expect(component.key).toBe('name');
    expect(component.reverse).toBe(true);
  });
  it('should toggle show', () => {
    component.isShown = false;
    component.toggleShow();
    expect(component.isShown).toBeTruthy();
  });
  // it('should set the task name', () => {
  // });
});
