import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationRoutingModule } from './pagination-routing.module';
import { PaginationComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    PaginationRoutingModule,
    FormsModule,
    NgxPaginationModule,

  ],
  exports: [
    PaginationComponent
  ],
})
export class PaginationModule { }
