import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessRoutingModule } from './process-routing.module';
import { FormsModule } from '@angular/forms';
import { RequestplannerComponent } from './requestplanner/requestplanner.component';
import { DetailrequestComponent } from './requestplanner/detailrequest/detailrequest.component';
import { RequestagencyComponent } from './requestagency/requestagency.component';


@NgModule({
  declarations: [
    RequestplannerComponent,
    RequestagencyComponent,
    DetailrequestComponent
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    FormsModule
  ]
})
export class ProcessModule { }
