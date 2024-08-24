import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessRoutingModule } from './process-routing.module';
import { FormsModule } from '@angular/forms';
import { RequestplannerComponent } from './requestplanner/requestplanner.component';


@NgModule({
  declarations: [
    RequestplannerComponent
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    FormsModule
  ]
})
export class ProcessModule { }
