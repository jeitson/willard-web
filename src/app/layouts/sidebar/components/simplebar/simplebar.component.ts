import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import SimpleBar from 'simplebar-core';
import { Options } from 'simplebar';

@Component({
  selector: 'ngx-simplebar',
  host: { 'data-simplebar': 'init' },
  templateUrl: './simplebar.component.html',
  styleUrls: ['./simplebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SimplebarComponent implements OnInit, AfterViewInit {
  @Input('options') options!: Options;

  elRef: ElementRef;
  SimpleBar: any;

  constructor(elRef: ElementRef, private zone: NgZone) {
    this.elRef = elRef;
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.SimpleBar = new SimpleBar(
        this.elRef.nativeElement,
        this.options || {}
      );
    });
  }

  ngOnDestroy() {
    this.SimpleBar.unMount();
    this.SimpleBar = null;
  }
}
