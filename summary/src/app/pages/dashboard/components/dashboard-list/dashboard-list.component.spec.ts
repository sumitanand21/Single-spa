import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterPipe } from 'ngx-filter-pipe';
import { OrderPipe } from 'ngx-order-pipe';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';
import { ExactFilterPipe } from 'src/app/libs/exact-filter.pipe';
import { SearchFilterPipe } from 'src/app/libs/search-filter.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardListComponent } from './dashboard-list.component';

describe('DashboardListComponent', () => {
  let component: DashboardListComponent;
  let fixture: ComponentFixture<DashboardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()],
      declarations: [DashboardListComponent,
        FilterPipe, SearchFilterPipe, ExactFilterPipe, AlphaNumericDirective, OrderPipe],
      providers: [{ provide: ToastrService, useValue: ToastrService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set new page size', () => {
    component.setNewPageSize(1);
    expect(component.config.itemsPerPage).toEqual(1);
  });

  it('Should set the current page number', () => {
    component.changepage(1);
    expect(component.config.currentPage).toEqual(1);
    expect(component.inputCurrentpage).toEqual(1);
  });

  it('Should set inputCurrentPage to Current Page', () => {
    const inputVal = 0;
    const lastPage = -1;
    component.changepageinp(inputVal, lastPage);
    expect(component.inputCurrentpage).toEqual(component.config.currentPage);
  });

  it('Should set Current page to input value', () => {
    const inputVal = 2;
    const lastPage = 30;
    component.changepageinp(inputVal, lastPage);
    expect(component.config.currentPage).toBe(inputVal);
  });

  it('Should set input current page and current page to default current page', () => {
    component.onsearchChange('test');
    expect(component.inputCurrentpage).toEqual(component.defaultCurrentPage);
    expect(component.config.currentPage).toEqual(component.defaultCurrentPage);
  });

  it('Sort function test to set true', () => {
    const key = 'test';
    component.key = 'test';
    component.sort(key);
    expect(component.reverse).toBeTruthy();
  });

  it('Sort function test to set key and reverse', () => {
    const key = 'test';
    component.key = 'test1';
    component.sort(key);
    expect(component.key).toEqual(key);
    expect(component.reverse).toBeTruthy();
  });
});

