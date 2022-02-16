import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';
import { ExactFilterPipe } from 'src/app/libs/exact-filter.pipe';
import { SearchFilterPipe } from 'src/app/libs/search-filter.pipe';

import { AddOrEditDashboardModalComponent } from './add-or-edit-dashboard-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SummaryService } from 'src/app/pages/summary/services/summary.service';

describe('AddOrEditDashboardModalComponent', () => {
  let component: AddOrEditDashboardModalComponent;
  let fixture: ComponentFixture<AddOrEditDashboardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule],
      declarations: [AddOrEditDashboardModalComponent, SearchFilterPipe, ExactFilterPipe, AlphaNumericDirective],

      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: ToastrService },
        SummaryService
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditDashboardModalComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set drop down data to empty', () => {
    // component.getDropDownData();
    // expect(component.datasetDropdown).toEqual([]);
  });

  it('Should call getDropDownData() function', () => {
    // spyOn(component, 'getDropDownData')
    // fixture.detectChanges();
    // expect(component.getDropDownData).toHaveBeenCalled();
  });
});
