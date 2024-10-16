import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionRoutingModule } from './reception-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReceptionComponent } from './reception.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ReceptionRoutingModule,
    NgxPaginationModule
  ]
})
export class ReceptionModule { }
