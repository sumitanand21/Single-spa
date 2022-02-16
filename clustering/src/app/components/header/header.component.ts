import { Component, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { FEATURES } from 'src/config/app.cofig';

declare var $;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  prefixUrl = this.globalService.prefixUrl;
  featureToggleData = FEATURES;
// document: any;
// navLinks: any[];
// activeLinkIndex = -1;
constructor(private router: Router , public globalService: GlobalService) {
  // this.navLinks = [
  //     {
  //         label: 'System Health',
  //         link: './System Health',
  //         index: 0
  //     },{
  //         label: 'Training',
  //         link: './Training',
  //         index: 1
  //     },{
  //         label: 'Anomaly',
  //         link: './anomaly',
  //         index: 2
  //     },{
  //       label: 'ForeCast',
  //       link: './forecast',
  //       index: 3
  //     },{
  //       label: 'Other Data Tools',
  //       link: './OtherTools',
  //       index: 4
  //     }, {
  //       label: 'Setting',
  //       link: './Setting',
  //       index: 5
  //     }

  // ];
}

ngOnInit(): void {
// this.router.events.subscribe((res) => {
//     this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
// });
}

}
