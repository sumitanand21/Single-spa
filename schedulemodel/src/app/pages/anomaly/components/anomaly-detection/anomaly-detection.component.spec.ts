import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomalyDetectionComponent } from './anomaly-detection.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { data } from 'jquery';

describe('AnomalyDetectionComponent', () => {
  let component: AnomalyDetectionComponent;
  let fixture: ComponentFixture<AnomalyDetectionComponent>;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnomalyDetectionComponent ],
      imports: [RouterTestingModule,
        HttpClientTestingModule, FormsModule,
        ReactiveFormsModule, MaterialModule,
        NgxPaginationModule, FilterPipeModule,
        Ng2SearchPipeModule, OrderModule,
        ModalModule.forRoot(), ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService },
        { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: data }],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnomalyDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('on On Init', () => {
    const spySuccess = spyOn(component, 'loadTableData');
    component.ngOnInit();
    expect(component.anomalyService.AnomalyDetection).toEqual(true);
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should  open view config  modal', () => {
    const blankObj = {};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.openModelConfigDialog(blankObj);
    expect(dialogSpy).toHaveBeenCalled();
  });
  it('should  set drop down values', () => {
   component.setDrapdownValues();
   expect(component.dataSetList.length).toBe(0);
   expect(component.modelTypeList.length).toBe(0);
   expect(component.anmdStatusList.length).toBe(0);
  });
  it('should change page on search to Default', () => {
    component.onsearchChange('forecast');
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
  });
  it('should check current and page that has changed', () => {
    component.changepage(0);
    expect(component.inputCurrentpage).toBe(0);
    expect(component.config.currentPage).toBe(0);
  });
  it('should check current and page that has changed', () => {
    component.tempAnomalyDetections = [{ checkboxdata: false }, { checkboxdata: false }];
    const mockObject = {
      target: {
        checked: true,
      }
    };
    component.checkAlls(mockObject);
    const result = component.tempAnomalyDetections.every(it => it.checkboxdata === true);
    expect(result).toBeTruthy();
  });
  it('should check all checked', () => {
    component.tempAnomalyDetections = [{ checkboxdata: false }, { checkboxdata: false }];
    component.isAllChecked();
    const result = component.tempAnomalyDetections.every(_ => _.checkboxdata);
    expect(result).toBeFalsy();
  });
  it('should set the PageSize', () => {
    component.setNewPageSize(5);
    expect(component.config.itemsPerPage).toBe(5);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
  });
  it('should Sort the table based on the keys', () => {
    component.sort('name');
    expect(component.key).toBe('name');
    expect(component.reverse).toBe(true);
  });
  it('changing the page on user input changepageinp', () => {
    component.config.currentPage = 2;
    component.changepageinp(2, 5);
    expect(component.config.currentPage).toBe(2);
    component.changepageinp(0, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
    component.changepageinp(10, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
  });
  it('should toggle view', () => {
    const flag = component.toggle;
    component.toggleView();
    expect(component.toggle).toEqual(!flag);
  });
  it('should toggle show', () => {
    const flag = component.isShown;
    component.toggleShow();
    expect(component.isShown).toEqual(!flag);
  });
  it('should set on destroy ', () => {
    component.ngOnDestroy();
    expect(component.anomalyService.AnomalyDetection).toEqual(false);
  });
  it('should switch tab ', () => {
    component.switchTab(0);
    expect(component.trTab).toEqual(true);
    component.switchTab(1);
    expect(component.trTab).toEqual(false);
  });
  it('should check if object exists ', () => {
    expect(component.checkifObjectExist(component.selectedModel)).toEqual(false);
  });
  it('should set display model', () => {
    component.displayModel('none');
    expect(component.anmdDetailsLoading).toEqual(true);
    expect(component.anmdTrResLoading).toEqual(true);
  });
  // it('should toggle icon', () => {
  //   expect( component.toggleicons('none')).toBeTruthy();
  // });
});
