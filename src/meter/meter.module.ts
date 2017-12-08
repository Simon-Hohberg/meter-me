import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { 
  MatToolbarModule, 
  MatListModule, 
  MatIconModule,
  MatButtonModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MeterComponent } from './meter.component';
import { MeterReaderComponent } from './meter-reader.component';
import { MeterListComponent } from './meter-list/meter-list.component';
import { MeterDetailsComponent } from './meter-details/meter-details.component';
import { MeterNewComponent } from './meter-new/meter-new.component';

const appRoutes: Routes = [
  { path: 'read',      component: MeterReaderComponent },
  { path: 'meters',    component: MeterListComponent },
  { path: 'new',       component: MeterNewComponent },
  { path: 'meter/:id', component: MeterDetailsComponent },
  { path: '',          component: MeterListComponent }
];

@NgModule({
  declarations: [
    MeterComponent,
    MeterReaderComponent,
    MeterListComponent,
    MeterDetailsComponent,
    MeterNewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [MeterComponent]
})
export class MeterModule { }
