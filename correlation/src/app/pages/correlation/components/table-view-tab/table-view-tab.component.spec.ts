import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatTabsModule, MatProgressBarModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router, Routes, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { data } from 'jquery';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { GlobalService } from 'src/app/services/global.service';
import { TestModule } from 'src/app/test/test.module';
import { CorrelationService } from '../../services/correlation.service';
import { CorrelationHeaderComponent } from '../correlation-header/correlation-header.component';

import { TableViewTabComponent } from './table-view-tab.component';
const routes: Routes = [

];
describe('TableViewTabComponent', () => {
  let component: TableViewTabComponent;
  let fixture: ComponentFixture<TableViewTabComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const spyQueryParam = jasmine.createSpyObj({ name: null });
  const mockActivatedRoute: any = { queryParams: of(spyQueryParam) };
  let correlationService: CorrelationService;
  let globalService: GlobalService;
  let httpMock: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableViewTabComponent,
      CorrelationHeaderComponent, AlphaNumericDirective],
      imports: [MatTabsModule,
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        MatProgressBarModule,
        FormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        NgxPaginationModule, FilterPipeModule,
        Ng2SearchPipeModule, OrderModule,
        ModalModule.forRoot(),
        TestModule],
      providers: [
        { provide: ToastrService, useClass: ToastrService },
        { provide: Router, useValue: routerSpy },
        { provide: APP_BASE_HREF, useValue : '/' },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    correlationService = TestBed.get(CorrelationService);
    globalService = TestBed.get(GlobalService);
    httpMock = TestBed.get(HttpTestingController);
    correlationService.correlationDetails.details = component.allCorrelationDetails = {
      selectedDataSet: 'adadad',
      selectedFeaturegroup: 'sdsdakks',
      selectedTimeFilterFeature: 'hhhh',
      enableTimeFilter: false,
      timeFilterFeature: 'time',
      selectedFeatureList: ['ddda', 'ahjjshhs'],
      from_Time: null,
      to_Time: null
    };
  });

  afterEach (() => {
    fixture.destroy();
    });

  it('should create', () => {
    component.allCorrelationDetails = correlationService.correlationDetails.details;
    expect(component).toBeTruthy();
  });
  it('should call ng on init', () => {
    component.ngOnInit();
    expect(component.allCorrelationDetails).toBeTruthy();
  });
  it('should navigate to upsert feature page', () => {
    correlationService.correlationDetails = undefined;
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
  it('should set clicked row', () => {
    const spyGetCompare = spyOn(component, 'getScatterplotterAPI');
    component.setClickedRow(0, {});
    expect(component.selectedRow).toBe(0);
    expect(spyGetCompare).toHaveBeenCalled();
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
  it('should handle enpty value', () => {
    let res = component.handleEmptyVal(undefined);
    expect(res).toBe('None');
    res = component.handleEmptyVal({});
    expect(res).toEqual({});
  });
  it('should get ISO string', () => {
    const res = component.toISO('Jan-16-2021 14:34');
    expect(res).toBe('2021-01-16T14:34:00Z');
  });
  it('should provide inputs to MAP', () => {
    const spygetHeatmapAPI = spyOn(component, 'getHeatmapAPI');
    component.provideInputsToMap({action: 'runcorr'});
    expect(component.headerData).toEqual({action: 'runcorr'});
    expect(spygetHeatmapAPI).toHaveBeenCalled();
    const spygetTableData = spyOn(component, 'getTableData');
    component.provideInputsToMap({action: 'oninput'});
    expect(component.headerData).toEqual({action: 'oninput'});
    expect(spygetTableData).toHaveBeenCalled();
    expect(component.searchFilter).toEqual('');
    const spyfilterGraphData = spyOn(component, 'filterGraphData');
    component.provideInputsToMap({action: 'run'});
    expect(component.headerData).toEqual({action: 'run'});
    expect(spyfilterGraphData).toHaveBeenCalled();
  });
  it('should create save object', () => {
    const sample = [{
      name: 'test',
      type: 'bool'
    }];
    const res = component.craeteSaveObject(sample);
    expect(res).toEqual({ test: 'bool' });
  });
  it('should get filtered details', () => {
    const sample = [{
      name: 'test',
      type: 'bool',
      correlation: 0.1
    }];
    const res = component.getFilteredDetils(sample);
    expect(res).toEqual([]);
  });
  it('should filter graph data', () => {
    const sample = [{
    }];
    const spygetScatterplotterAPI = spyOn(component, 'getScatterplotterAPI');
    const spyonsearchChange = spyOn(component, 'onsearchChange');
    const res = component.filterGraphData(sample);
    expect(spygetScatterplotterAPI).toHaveBeenCalled();
    expect(spyonsearchChange).toHaveBeenCalled();
    expect(component.selectedRow).toEqual(0);
    expect(component.tableData).toEqual([]);
  });
});
