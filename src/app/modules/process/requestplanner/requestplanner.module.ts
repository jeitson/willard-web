import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestplannerRoutingModule } from './requestplanner-routing.module';
import { DetailrequestComponent } from './detailrequest/detailrequest.component';


@NgModule({
  declarations: [
    DetailrequestComponent
  ],
  imports: [
    CommonModule,
    RequestplannerRoutingModule
  ]
})
export class RequestplannerModule { }
