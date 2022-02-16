import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { RouterModule, Router, Routes } from '@angular/router';
import { FeatureGuard } from './feature-guard.service';
const routes: Routes = [

];

describe('FeatureGuardService', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),HttpClientTestingModule,MatDialogModule],
    providers: [{ provide: Router, useValue: routerSpy }]
  }));

  it('should be created', () => {
    const service: FeatureGuard = TestBed.get(FeatureGuard);
    expect(service).toBeTruthy();
  });
});
