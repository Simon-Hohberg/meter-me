import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'meter-list',
  templateUrl: './meter-list.component.html',
  styleUrls: ['./meter-list.component.css']
})
export class MeterListComponent implements OnInit {

  private meters: Array<any> = [
    {
      id: 1,
      type: "electricity",
      consumption: 50,
      unit: "kWh"
    },
    {
      id: 2,
      type: "water",
      consumption: 100,
      unit: "l"
    },
    {
      id: 3,
      type: "gas",
      consumption: 20,
      unit: "cubicm"
    },
  ]

  constructor() { }

  ngOnInit() {
  }

  getIconForType(type: string) {
    switch (type) {
      case "electricity":
        return "lightbulb_outline";
      case "water":
      return "opacity";
      case "gas":
      default:
        return "folder";
    }
  }

}
