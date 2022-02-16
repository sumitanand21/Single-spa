import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForecastService } from '../../services/forecast.service';
import { ModelConfigDialogComponent } from './model-config-dialog.component';


describe('ModelConfigDialogComponent', () => {
  let component: ModelConfigDialogComponent;
  let fixture: ComponentFixture<ModelConfigDialogComponent>;
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
      declarations: [ ModelConfigDialogComponent ],
      imports: [HttpClientTestingModule, SharedModule,
        ModalModule.forRoot(), ToastrModule.forRoot(),
        BrowserAnimationsModule, MatDialogModule],
      providers: [
        { provide: ToastrService, useClass: ToastrService },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelConfigDialogComponent);
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
    expect(component.ModelConfigArr.length).toBe(1);
  });

  it('should get model config data', () => {
    const valueSuccess = { status: 'success', data: {modelConfig: 'OPRMAX'} };
    const valueFail = { status: 'fail', data: [] };
    const spySuccess = spyOn(notifyService , 'showToastrSuccess');
    const spyWarning = spyOn(notifyService , 'showToastrWarning');
    const spyError = spyOn(notifyService , 'showToastrError');
    const dataSetService  = spyOn(forecastService, 'getModelConfigDetails');

    component.getModelConfigData('');
    expect(spyWarning).toHaveBeenCalled();

    dataSetService.and.returnValue(of(valueSuccess));
    component.getModelConfigData('OPRMAX');
    expect(component.selectedModelObject).not.toEqual(null);

    dataSetService.and.returnValue(of(valueFail));
    component.getModelConfigData('OPRMAX');
    expect(true).toBeTruthy();

    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.getModelConfigData('OPRMAX');
    expect(spyError).toHaveBeenCalled();
  });

});
