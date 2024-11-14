import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionRoutingModule } from './reception-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReceptionComponent } from './reception.component';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReceptionComponent
  ],
  imports: [
    CommonModule,
    ReceptionRoutingModule,
    PaginationModule,
    FormsModule
  ]
})
export class ReceptionModule { }
