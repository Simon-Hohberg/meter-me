import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Meter } from '../model/meter'
import { MeterService } from '../meter.service';

@Component({
  selector: 'app-meter-details',
  templateUrl: './meter-details.component.html',
  styleUrls: ['./meter-details.component.css']
})
export class MeterDetailsComponent implements OnInit {

  private meter: Meter;

  constructor(
    private route: ActivatedRoute,
    private meterService: MeterService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.meter = this.meterService.getMeter(params.get('id'));
    });
  }

}
