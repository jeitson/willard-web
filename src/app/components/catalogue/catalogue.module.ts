import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CatalogueComponent } from './catalogue.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CatalogueComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CatalogueRoutingModule
  ],
  exports: [
    CatalogueComponent
  ]
})
export class CatalogueModule { }
