import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingRoutingModule } from './shipping-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShippingComponent } from './shipping.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShippingRoutingModule,
    NgxPaginationModule
  ]
})
export class ShippingModule { }
