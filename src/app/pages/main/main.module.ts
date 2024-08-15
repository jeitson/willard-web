import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDanisoftUtilsModule } from 'ngx-danisoft-utils';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import {
  NgbAccordionModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbProgressbarModule,
  NgbRatingModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main.component';
// import { LandingComponent } from '../landing/landing.component';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { MainRoutingModule } from './main-routing.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    LayoutsModule,
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDanisoftUtilsModule,
    ZXingScannerModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbRatingModule,
    NgbProgressbarModule,
    NgbCarouselModule,
    NgbTooltipModule,
    NgbDropdownModule,
  ],
})
export class MainModule {}
