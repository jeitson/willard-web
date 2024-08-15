import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypedocumentsRoutingModule } from './typedocuments-routing.module';
import { TypedocumentsComponent } from './typedocuments.component';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    TypedocumentsComponent
  ],
  imports: [
    CommonModule,
    TypedocumentsRoutingModule,
    CatalogueModule
  ]
})
export class TypedocumentsModule { }
