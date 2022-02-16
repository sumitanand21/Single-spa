import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Sanitizer } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SummaryService } from '../../services/summary.service';

import { IframeDashboardComponent } from './iframe-dashboard.component';

export class MockService {
  dashboardDetails = {
    url: ""
  }
}

describe('IframeDashboardComponent', () => {
  let component: IframeDashboardComponent;
  let fixture: ComponentFixture<IframeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IframeDashboardComponent],
      providers: [{ provide: SummaryService, useClass: MockService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set Iframe Url to emplty',()=>{
    component.getIframeData();
    expect(component.iFrameUrl).toBe('');
  })
});
