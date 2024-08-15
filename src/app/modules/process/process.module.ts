import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessRoutingModule } from './process-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { FormsModule } from '@angular/forms';
import { CollectionCentersComponent } from './collection-centers/collection-centers.component';
import { ProductComponent } from './product/product.component';
import { ConveyorComponent } from './conveyor/conveyor.component';
import { AdviserComponent } from './adviser/adviser.component';

@NgModule({
  declarations: [
    CustomersComponent,
    CollectionCentersComponent,
    ProductComponent,
    ConveyorComponent,
    AdviserComponent
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    FormsModule
  ]
})
export class ProcessModule { }
