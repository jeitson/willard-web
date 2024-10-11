import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryRoutingModule } from './country-routing.module';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CountryComponent } from './country.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    CountryComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule,
    CatalogueModule
  ]
})
export class CountryModule { }
