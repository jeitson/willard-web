import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestLogsRoutingModule } from './request-logs-routing.module';
import { RequestLogsComponent } from './request-logs.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RequestLogsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RequestLogsRoutingModule,
  ]
})
export class RequestLogsModule { }
