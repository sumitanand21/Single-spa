import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { SessionService } from 'src/app/auth/session.service';
import { SESSION } from 'src/app/constants/app.constants';
import { SOCKET_FEATURE } from 'src/config/app.cofig';
@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss']
})
export class ClassificationComponent implements OnInit, AfterViewChecked {

  constructor(
    private cdref: ChangeDetectorRef,
    private sessionStorage: SessionService) {
    this.sessionStorage.setKeyValue(SESSION.FEATURE, SOCKET_FEATURE.CLASSIFICATION); }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

}
