import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ForecastService } from './forecast.service';
import { MatDialog, MatDialogModule } from '@angular/material';
import { FORECAST_URLS } from '../constants/forecast.constants';

describe('ForecastService', () => {
  let httpMock: HttpTestingController;
  let forecastService: ForecastService;
  const data = { dataSetName : undefined,
    dataId : undefined,
    jobType: undefined,
    modelConfig: undefined };
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, MatDialogModule],
    providers: [],
  }));

  beforeEach(() => {
    forecastService = TestBed.get(ForecastService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: ForecastService = TestBed.get(ForecastService);
    expect(service).toBeTruthy();
  });

  it('should get forecast Processing Model Details', () => {
    forecastService.forecastProcessingModelDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.GET_FORECASTPROCESSING_MODELCONFIG_DETAILS_API}${data.dataSetName}/${data.dataId}`);
    expect(req.request.method).toBe('GET');
  });

  it('should get forecast Processing table', () => {
    forecastService.forecastProcessingtable({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.GET_FORECAST_PROCESSING_API }${data.dataSetName}`);
    expect(req.request.method).toBe('GET');
  });


  it('should get Forecast Selection table', () => {
    forecastService.ForecastSelectiontable({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.GET_FORECAST_SELECTION_API }${data.dataSetName}`);
    expect(req.request.method).toBe('GET');
  });


  it('should Forecast Selection Update table', () => {
    forecastService.ForecastSelectionUpdatetable({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.UPDATE_FORECAST_SELECTION_TABLE_API}`);
    expect(req.request.method).toBe('PUT');
  });

  it('should get getModel Config Details', () => {
    forecastService.getModelConfigDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.GET_MODELCONFIG_DETAILS_API }${data.jobType}/${data.modelConfig}`);
    expect(req.request.method).toBe('GET');
  });

  it('should update Forecast Selection', () => {
    forecastService.updateForecastSelection({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.PUT_UPDATE_FORECASTSELECTION_API }`);
    expect(req.request.method).toBe('PUT');
  });

  it('should save Forecast Selection', () => {
    forecastService.saveForecastSelection({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.POST_SAVE_FORECASTSELECTION_API }`);
    expect(req.request.method).toBe('POST');
  });

  it('should handle Forecast Processing', () => {
    forecastService.handleForecastProcessing({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.PUT_HANDLE_FORECASTPROCESSING_API }`);
    expect(req.request.method).toBe('PUT');
  });

  it('should get Model Config UpdateDetails', () => {
    forecastService.getModelConfigUpdateDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.GET_MODELCONFIG_DETAILS_API  }${data.jobType}/${data.modelConfig}`);
    expect(req.request.method).toBe('GET');
  });

  it('should create Model Config Details', () => {
    forecastService.createModelConfigDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.POST_CREATE_FORECASTMODELCONFIG_API   }${data.jobType}`);
    expect(req.request.method).toBe('POST');
  });


  it('should Update Model Config Details', () => {
    forecastService.UpdateModelConfigDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.PUT_UPDATE_FORECASTMODELCONFIG_API   }${data.jobType}`);
    expect(req.request.method).toBe('PUT');
  });

  it('should delete Model Config Details', () => {
    forecastService.deleteModelConfigDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.DELETE_REMOVE_FORECASTMODELCONFIG_API    }${data.jobType}`);
    expect(req.request.method).toBe('DELETE');
  });

  it('should schedule Selection Details', () => {
    forecastService.scheduleSelectionDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.PUT_SCHEDULE_FORECASTSELECTION_API   }`);
    expect(req.request.method).toBe('PUT');
  });

  it('should get Forecast Compare Details', () => {
    forecastService.getForecastCompareDetails({}).subscribe();
    const req = httpMock.expectOne(`${FORECAST_URLS.POST_FETCH_FORECASTCOMPARE_API   }`);
    expect(req.request.method).toBe('POST');
  });

});
