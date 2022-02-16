import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { SingleSpaService } from 'src/app/services/single-spa.service';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('userDetMenuTrigger', { static: false }) trigger: MatMenuTrigger;
  networkSpeedStatus = false;
  user = 'admin';
  userProfile: any = undefined;
  keyCloakInstance: any = undefined;
  currentDate = new Date().toLocaleString('en-US', { timeZone: 'GMT' });
  @Output() emitOut = new EventEmitter<any>();
  constructor(private router: Router, private keycloakService: KeycloakService, public spaService: SingleSpaService) {
    setInterval(() => {
      this.currentDate = new Date().toLocaleString('en-US', { timeZone: 'GMT' });
    }, 1);
  }

  ngOnInit(): void {
    this.keyCloakInstance = this.keycloakService.getKeycloakInstance();
    console.log("keyCloakInstance", this.keyCloakInstance);
    this.user = this.keycloakService.getUsername();
    this.keycloakService.loadUserProfile().then(profile => {
      this.userProfile = profile;
    });
  }

  closeUesrMenu() {
    this.trigger.closeMenu();
  }

  getFirstChar(strVal) {
    if (strVal) {
      const tempStr = strVal.trim();
      return tempStr ? tempStr.charAt(0) : 'A';
    } else {
      return 'A';
    }
  }

  toggleSideNav() {
    this.emitOut.emit(true);
  }

  openKeyCloak(){
    this.closeUesrMenu();
  }

  logOut() {
    this.closeUesrMenu();
    this.keycloakService.logout();
  }

  upsertConfiguration() {
    this.router.navigate(['/upsertapp']);
  }
}
