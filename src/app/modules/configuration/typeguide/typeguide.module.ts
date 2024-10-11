import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeguideRoutingModule } from './typeguide-routing.module';
import { TypeguideComponent } from './typeguide.component';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    TypeguideComponent
  ],
  imports: [
    CommonModule,
    TypeguideRoutingModule,
    CatalogueModule
  ]
})
export class TypeguideModule { }
