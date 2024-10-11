import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeadquartercopyRoutingModule } from './headquartercopy-routing.module';
import { HeadquartercopyComponent } from './headquartercopy.component';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    HeadquartercopyComponent
  ],
  imports: [
    CommonModule,
    HeadquartercopyRoutingModule,
    CatalogueModule
  ]
})
export class HeadquartercopyModule { }
