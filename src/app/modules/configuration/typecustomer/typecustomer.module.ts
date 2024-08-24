import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypecustomerRoutingModule } from './typecustomer-routing.module';
import { TypecustomerComponent } from './typecustomer.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    TypecustomerComponent
  ],
  imports: [
    CommonModule,
    TypecustomerRoutingModule,
    CatalogueModule
  ]
})
export class TypecustomerModule { }
