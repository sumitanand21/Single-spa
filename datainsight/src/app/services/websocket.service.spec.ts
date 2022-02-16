import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { BaseRequestOptions,Http,HttpModule} from '@angular/http';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {
  MockBackend,
} from '@angular/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../libs/material/material.module';

describe('WebsocketService', () => {
  let backend: MockBackend;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpModule,
        MaterialModule],
        providers: [HttpClient,Http, HttpHandler,MockBackend,BaseRequestOptions,
          {provide: Http,useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]},
          {provide: ToastrService, useClass: ToastrService},
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: [] }]
    })
    .compileComponents();
  }));
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service).toBeTruthy();
  });
});
