import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DataManagementService } from './services/data-management.service';
import { SessionService } from 'src/app/auth/session.service';
import { SESSION } from 'src/app/constants/app.constants';
import { SOCKET_FEATURE } from 'src/config/app.cofig';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'datainsight-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit, AfterViewChecked {

  constructor(public dataManagementService: DataManagementService,
              public global: GlobalService,
              private router: Router,
              private cdref: ChangeDetectorRef,
              private sessionStorage: SessionService) {
                this.sessionStorage.setKeyValue(SESSION.FEATURE, SOCKET_FEATURE.DATAMANAGEMENT);
              }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  dataManagementNavigation(navigationpath) {
    this.router.navigate(['/' + this.global.prefixUrl + navigationpath]);
  }

}
