import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
