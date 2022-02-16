import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForecastService } from '../../services/forecast.service';

import { StopForecastProcessComponent } from './stop-forecast-process.component';

describe('StopForecastProcessComponent', () => {
  let component: StopForecastProcessComponent;
  let fixture: ComponentFixture<StopForecastProcessComponent>;
  let forecastService: ForecastService;
  let notifyService: NotificationService;
  const dialogMock = {
    close: () => { }
  };
  const mockData = {dataSet: { dataId: 'IMQ' }};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopForecastProcessComponent ],
      imports: [MatDialogModule, SharedModule, ToastrModule.forRoot(),
        BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopForecastProcessComponent);
    forecastService = TestBed.get(ForecastService);
    notifyService = TestBed.get(NotificationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop forecast', () => {
    const valueSuccess = { status: 'success', data: [] };
    const valueFail = { status: 'fail', data: [] };
    const spySucess = spyOn(notifyService , 'showToastrSuccess');
    const spyWarning = spyOn(notifyService , 'showToastrWarning');
    const spyError = spyOn(notifyService , 'showToastrError');
    const dataSetService  = spyOn(forecastService, 'handleForecastProcessing');
    dataSetService.and.returnValue(of(valueSuccess));
    component.stopForecastProcess();
    expect(spySucess).toHaveBeenCalled();

    dataSetService.and.returnValue(of(valueFail));
    component.stopForecastProcess();
    expect(spyWarning).toHaveBeenCalled();

    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.stopForecastProcess();
    expect(spyError).toHaveBeenCalled();
  });

});
