import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from './core/events/event-bus.service';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'wlrd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  eventModeDarkSub?: Subscription;
  constructor(
    private storageService: StorageService,
    private eventBusService: EventBusService
  ) {}
  ngOnInit(): void {
    this.eventModeDarkSub = this.eventBusService.on('woo|darkMode', () => {
      console.log('darkMode::', this.storageService.DarkModeActive);
      this.storageService.isDarkModeActive = this.storageService.DarkModeActive;
    });
  }
  ngOnDestroy(): void {
    this.eventModeDarkSub?.unsubscribe();
  }
}
