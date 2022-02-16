import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

const routes: Routes = [

];
describe('AnomalyComponent', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let httpMock: HttpTestingController;

});
