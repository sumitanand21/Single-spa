import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnomalyComponent } from './anomaly.component';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

const routes: Routes = [

];
describe('AnomalyComponent', () => {
  let component: AnomalyComponent;
  let fixture: ComponentFixture<AnomalyComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        MatDialogModule,
        RouterModule.forRoot(routes)],
      declarations: [ AnomalyComponent ],
      providers: [{ provide: Router, useValue: routerSpy }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnomalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
