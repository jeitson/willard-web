import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationdepartureRoutingModule } from './locationdeparture-routing.module';
import { LocationdepartureComponent } from './locationdeparture.component';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    LocationdepartureComponent
  ],
  imports: [
    CommonModule,
    LocationdepartureRoutingModule,
    CatalogueModule
  ]
})
export class LocationdepartureModule { }
