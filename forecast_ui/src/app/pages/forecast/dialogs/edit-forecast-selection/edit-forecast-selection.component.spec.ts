import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditForecastSelectionComponent } from './edit-forecast-selection.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationService } from 'src/app/services/notification.service';
import { ForecastService } from '../../services/forecast.service';
import { of, throwError } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';

describe('EditForecastSelectionComponent', () => {
  let component: EditForecastSelectionComponent;
  let fixture: ComponentFixture<EditForecastSelectionComponent>;
  const valueArr = [{ id: 1 }, { id: 2 }];
  let forecastService: ForecastService;
  let notifyService: NotificationService;
  let globalService: GlobalService;
  const dialogMock = {
    close: () => { }
  };
  const mockData = {forecastEdit: { dataId: 'IMQ',
  threadId: '12', dataFrequency : 'asdf', defaultDataRange: '1,2', timeForForwardPrediction: '40' }};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditForecastSelectionComponent],
      imports: [HttpClientTestingModule, SharedModule,
        ModalModule.forRoot(), ToastrModule.forRoot(),
        BrowserAnimationsModule, MatDialogModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditForecastSelectionComponent);
    forecastService = TestBed.get(ForecastService);
    notifyService = TestBed.get(NotificationService);
    globalService = TestBed.get(GlobalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check model param', () => {
    component.checkmodelparam();
    const valueSuccess = { status: 'success', data: [{modelConfigName: 'OPMAX'}] };
    const valueFail = { status: 'fail', data: [] };
    const dataSetService  = spyOn(forecastService, 'getAllModelConfigs');
    dataSetService.and.returnValue(of(valueSuccess));
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(1);

    dataSetService.and.returnValue(of(valueFail));
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(0);

    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(0);
  });

  it('should not save if min max time Error', () => {
    component.editDataFrequency = 0;
    component.mintime = '';
    component.maxtime  = '';
    const spyFunction = spyOn(globalService , 'opendisplayModal');

    component.saveforecastAPI();
    expect(spyFunction).toHaveBeenCalled();

    component.editDataFrequency = 0.8;
    component.mintime = '1234';
    component.maxtime  = '12345';
    component.saveforecastAPI();
    expect(spyFunction).toHaveBeenCalled();

    component.editDataFrequency = 1;
    component.mintime = '1234';
    component.maxtime  = '42949672967';
    component.saveforecastAPI();
    expect(spyFunction).toHaveBeenCalled();

    component.editDataFrequency = 1;
    component.mintime = '429496729789';
    component.maxtime  = '4294967294';
    component.saveforecastAPI();
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should save forecast', () => {

    component.editDataFrequency = 1;
    component.mintime = '4294967282';
    component.maxtime  = '4294967294';
    const valueSuccess = { status: 'success', data: [] };
    const valueFail = { status: 'fail', data: [] };
    const spySuccess = spyOn(notifyService , 'showToastrSuccess');
    const spyWarning = spyOn(notifyService , 'showToastrWarning');
    const spyError = spyOn(notifyService , 'showToastrError');
    const dataSetService  = spyOn(forecastService, 'ForecastSelectionUpdatetable');
    dataSetService.and.returnValue(of(valueSuccess));
    component.saveforecastAPI();
    expect(spySuccess).toHaveBeenCalled();

    dataSetService.and.returnValue(of(valueFail));
    component.saveforecastAPI();
    expect(spyWarning).toHaveBeenCalled();

    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.saveforecastAPI();
    expect(spyError).toHaveBeenCalled();
  });

});
