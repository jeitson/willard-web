import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestplannerRoutingModule } from './requestplanner-routing.module';
import { DetailrequestComponent } from './detailrequest/detailrequest.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    RequestplannerRoutingModule
  ]
})
export class RequestplannerModule { }
