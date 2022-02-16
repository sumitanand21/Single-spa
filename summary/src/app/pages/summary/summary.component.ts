import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SummaryService } from './services/summary.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'summary-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  constructor(public summaryService: SummaryService, public sanitizer: DomSanitizer,
              private router: Router,
              private notify: NotificationService) {
  }

  ngOnInit() {

  }

}
