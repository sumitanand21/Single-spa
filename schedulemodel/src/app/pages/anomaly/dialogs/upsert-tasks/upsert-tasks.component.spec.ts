import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { event } from 'jquery';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/libs/material/material.module';

import { UpsertTasksComponent } from './upsert-tasks.component';

describe('UpsertTasksComponent', () => {
  let component: UpsertTasksComponent;
  let fixture: ComponentFixture<UpsertTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertTasksComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule, ReactiveFormsModule,
        MaterialModule, NgxPaginationModule,
        FilterPipeModule, Ng2SearchPipeModule,
        OrderModule, ModalModule.forRoot(),
        ToastrModule.forRoot(),
        BrowserAnimationsModule],
        providers: [
          {provide: ToastrService, useClass: ToastrService},
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: [] }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ng on init for new task', () => {
    component.ngOnInit();
    expect(component.title).toBe('New Task');
  });
  it('should call ng on init for update task', () => {
    component.data.action = 'Update';
    component.ngOnInit();
    expect(component.title).toBe('Edit Schedule');
  });
  it('should call load master data', () => {
    const spySuccess = spyOn(component, 'loadMaster');
    component.ngOnInit();
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should call create form', () => {
    component.modelMasterData = [
      {
        modelConfigName: 'testmodel2',
        modelType: 'MODELI',
        modelConfigCount: 0
      },
      {
        modelConfigName: 'testmodel3',
        modelType: 'MODELII',
        modelConfigCount: 0
      }
    ];
    const spySuccess = spyOn(component, 'createForm');
    component.setPageData();
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should call initialise form', () => {
    component.modelMasterData = [
      {
        modelConfigName: 'testmodel2',
        modelType: 'MODELI',
        modelConfigCount: 0
      },
      {
        modelConfigName: 'testmodel3',
        modelType: 'MODELII',
        modelConfigCount: 0
      }
    ];
    const task =  {
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
      schedule_to: '2020-12-23 4:11:00 UTC'
  };
    component.initializeForm(task);
    expect(component.upsertTask).toBeTruthy();
  });
  it('should create form', () => {
    component.modelMasterData = [
      {
        modelConfigName: 'testmodel2',
        modelType: 'MODELI',
        modelConfigCount: 0
      },
      {
        modelConfigName: 'testmodel3',
        modelType: 'MODELII',
        modelConfigCount: 0
      }
    ];
    component.createForm();
    expect(component.upsertTask).toBeTruthy();
  });
  it('should initialise form', () => {
    component.data.action = 'Update';
    const spySuccess = spyOn(component, 'initializeForm');
    component.setPageData();
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should update model config list on model changes ', () => {
    component.modelMasterData = [
      {
        modelConfigName: 'testmodel2',
        modelType: 'MODELI',
        modelConfigCount: 0
      },
      {
        modelConfigName: 'testmodel3',
        modelType: 'MODELII',
        modelConfigCount: 0
      }
    ];
    component.modelChange(component.modelMasterData[0].modelType);
    expect(component.modelConfigList.length).toBe(0);
  });
  it('should set freq data ', () => {
    const spySuccess = spyOn(component, 'setDayControls');
    component.setFreqData('one-time');
    expect(component.isDayEnabled).toBeFalsy();
    component.setFreqData('daily');
    expect(component.isDayEnabled).toBeFalsy();
    component.setFreqData('weekly');
    expect(component.isDayEnabled).toBeTruthy();
    component.setFreqData('monthly');
    expect(component.isDayEnabled).toBeFalsy();
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should set day controls  ', () => {
    component.setDayControls();
    expect(component.isDayEnabled).toBeFalsy();
    expect(component.upsertTask).toBeTruthy();
  });
  it('should call save function', () => {
    component.upsertSc();
    expect(component.upsertTask).toBeTruthy();
  });
  // it('should call toaster info', () => {
  //   const msg = 'info';
  //   const header = 'Alert';
  //   const toastr = TestBed.get(ToastrService);
  //   const spytoast = spyOn(toastr, 'info');
  //   component.showToastrinfo(msg, header);
  //   expect(spytoast).toHaveBeenCalled();
  // });
  // it('should show success toast message', () => {
  //   const msg = 'success';
  //   const header = 'Alert';
  //   const toaster = TestBed.get(ToastrService);
  //   const spytoaster = spyOn(toaster, 'success');
  //   component.showToastrSuccess(msg, header);
  //   expect(spytoaster).toHaveBeenCalled();
  // });
  // it('should select end date type', async(() => {
  //   const endDateBTN = document.getElementById('ddd');
  //   endDateBTN.click();
  //   expect(component.checkState).toHaveBenCalled();
  // }));
});
