import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    FormsModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
