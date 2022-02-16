import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  appId;
  selectedRoute;
  features = [];
  namespace;
  @Output() emitNavbarOut = new EventEmitter<any>();
  @Input()
  set setFeatures(value) {
    if (value && value.length > 0) {
      this.loadNavBar(value);
    }
  }
constructor(private router: Router) {
  const subRouter = router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.selectedRoute = event.url;
    }
  });
}

ngOnInit(): void {
}
loadNavBar(res) {
    this.features = res;
}
navigateTo(routePath, item) {
this.selectedRoute = routePath;
// this.router.navigateByUrl(routePath);
this.emitNavbarOut.emit(item);
}
}
