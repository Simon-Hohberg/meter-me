import { Injectable } from '@angular/core';
import { Meter } from './model/meter';

@Injectable()
export class MeterService {

  private meters: Map<string, Meter>;

  constructor() { }

  public getMeter(id: string): Meter {
    return this.meters.get(id);
  }
}
