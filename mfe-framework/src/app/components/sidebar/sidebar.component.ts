
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
export interface SideMenu {
  name: string;
  menuItems: Array<any>;
  img: any;
  routerLink: string;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  isActive = true;
  opened = true;
  headerName;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  isSelected = false;
  reason = '';
  defaultLocale = 'en';
  defaultMenu = [
    // {
    //   name: 'Container',
    //   img: 'assets/icons/icons8-medical-container-50.png',
    //   routerLink: '/container',
    //   menuItems: [
    //     {
    //       name: 'View',
    //       routerLink: '/container',
    //       isSelected: false,
    //     },
    //     {
    //       name: 'Add New App',
    //       routerLink: '/upsertapp',
    //       isSelected: false,
    //     },
    //     {
    //       name: 'Restore Apps',
    //       routerLink: '/restoreapp',
    //       isSelected: false,
    //     }
    //   ],
    // },
    // {
    //   name: 'Settings',
    //   img: 'assets/icons/icons8-settings-50.png',
    //   routerLink: '/settings',
    //   menuItems: [
    //     {
    //       name: 'View',
    //       routerLink: '/settings',
    //       isSelected: true,
    //     },
    //   ],
    // },
    // {
    //   name: 'About',
    //   img: 'assets/icons/icons8-info-50.png',
    //   routerLink: '/info',
    //   menuItems: [
    //     {
    //       name: 'info',
    //       routerLink: '/info',
    //       isSelected: false,
    //     }
    //   ],
    // }
  ];
  disableAnimation = true;
  panelOpenState = false;
  sideMenuData: SideMenu[];
  @Input()
  set sideBarApps(value) {
    this.intializeMenu(value);
  }
  @Output() emitSidebarOut = new EventEmitter<any>();
  constructor(private keycloakService: KeycloakService,
              public router: Router,
  ) { }
  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  ngOnInit() {
    // this.sidenav.open();
  }


  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }

  logOut() {
      this.keycloakService.logout();
  }

  closeSideNav(value) {
    if (value === true) {
      this.emitSidebarOut.emit(true);
    }
  }

  intializeMenu(appMenu) {
    this.sideMenuData = [...appMenu];
  }
}
