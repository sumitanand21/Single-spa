import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastComponent } from './forecast.component';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { MatDialogModule } from '@angular/material';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForecastService } from './services/forecast.service';
import { RouterTestingModule } from '@angular/router/testing';
describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  let httpMock: HttpTestingController;
  let forecastService: ForecastService;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastComponent],
      imports: [HttpClientTestingModule, SharedModule,
         MatDialogModule, RouterTestingModule, ModalModule.forRoot(), ToastrModule.forRoot()],
      providers: [BsModalService,
        { provide: ToastrService, useClass: ToastrService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    forecastService = TestBed.get(ForecastService);
    forecastService.activatedPath = '/forecast/forecastselect';
    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to model configuration page by cleaing saved Values', () => {
    const routeSyp = spyOn(router, 'navigate').and.stub();
    const navigatePath = '/forecast/modelconfig';

    forecastService.ForeCastProcessing = true;
    component.forecastNavigation(navigatePath, 1);
    expect(routeSyp).toHaveBeenCalled();

    forecastService.ForeCastSelection = true;
    component.forecastNavigation(navigatePath, 1);
    expect(routeSyp).toHaveBeenCalled();

    component.forecastNavigation(navigatePath, 2);
    expect(routeSyp).toHaveBeenCalled();

    component.forecastNavigation(navigatePath, 3);
    expect(routeSyp).toHaveBeenCalled();

    component.forecastNavigation(navigatePath);
    expect(routeSyp).toHaveBeenCalled();
  });

});
