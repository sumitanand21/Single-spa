import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomalyViewComponent } from './anomaly-view.component';
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AnomalyViewComponent', () => {
  let component: AnomalyViewComponent;
  let fixture: ComponentFixture<AnomalyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnomalyViewComponent ],
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxPaginationModule,
        FilterPipeModule,
        Ng2SearchPipeModule,
        OrderModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        BrowserAnimationsModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService }],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnomalyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should change page on search to Default', () => {
    component.onsearchChange('forecast');
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
  });
  it('should check current and page that has changed', () => {
    component.changepage(0, true);
    expect(component.inputCurrentpage).toBe(0);
    expect(component.config.currentPage).toBe(0);
    component.changepage(0, false);
    expect(component.inputCurrentpageMinTable).toBe(0);
    expect(component.configMinTable.currentPage).toBe(0);
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
    component.setNewPageSize(5, true);
    expect(component.config.itemsPerPage).toBe(5);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
    component.setNewPageSize(5, false);
    expect(component.configMinTable.itemsPerPage).toBe(5);
    expect(component.configMinTable.currentPage).toBe(1);
    expect(component.inputCurrentpageMinTable).toBe(1);
  });
  it('should Sort the table based on the keys', () => {
    component.sort('name');
    expect(component.key).toBe('name');
    expect(component.reverse).toBe(true);
  });
  it('changing the page on user input changepageinp', () => {
    component.config.currentPage = 2;
    component.changepageinp(2, 5, true);
    expect(component.config.currentPage).toBe(2);
    component.changepageinp(0, 5, true);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
    component.changepageinp(10, 5, true);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
    component.configMinTable.currentPage = 2;
    component.changepageinp(2, 5, false);
    expect(component.configMinTable.currentPage).toBe(2);
    component.changepageinp(0, 5, false);
    expect(component.inputCurrentpageMinTable).toBe(component.configMinTable.currentPage);
    component.changepageinp(10, 5, false);
    expect(component.inputCurrentpageMinTable).toBe(component.configMinTable.currentPage);
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
});
