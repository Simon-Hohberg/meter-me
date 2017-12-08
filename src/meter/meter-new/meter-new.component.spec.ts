import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterNewComponent } from './meter-new.component';

describe('MeterNewComponent', () => {
  let component: MeterNewComponent;
  let fixture: ComponentFixture<MeterNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
