import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {timer} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-empty-route',
  template: '',
})
export class EmptyRouteComponent implements OnInit, OnDestroy {
  alive = true;

  constructor(private router: Router){

  }

  ngOnInit(){
    timer(1000).pipe(takeWhile(() => this.alive)).subscribe(_ => {
       this.router.navigate(['/container']);
    });
  }

  ngOnDestroy()
  {
      this.alive = false;
  }
}
