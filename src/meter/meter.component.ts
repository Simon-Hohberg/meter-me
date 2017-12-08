import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'meter-root',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.css']
})
export class MeterComponent {
  
  title = 'Meter Me';
  canGoBack: boolean = false;

  constructor(public location: Location, private router: Router) {
    this.canGoBack = this.location.path(false) !== "";
    this.router.events.subscribe((e) => {
      this.canGoBack = location.path(false) !== "";
    });
  }

  goBack() {
    this.location.back();
  }
}
