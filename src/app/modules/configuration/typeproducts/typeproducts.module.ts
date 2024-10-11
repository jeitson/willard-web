import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeproductsRoutingModule } from './typeproducts-routing.module';
import { TypeproductsComponent } from './typeproducts.component';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    TypeproductsComponent
  ],
  imports: [
    CommonModule,
    TypeproductsRoutingModule,
    CatalogueModule
  ]
})
export class TypeproductsModule { }
