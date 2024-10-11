import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    // Emit the current status
    this.updateOnlineStatus();

    // Listen to the window events
    merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    ).subscribe(status => this.onlineStatus.next(status));
  }

  get isOnline() {
    return this.onlineStatus.asObservable();
  }

  private updateOnlineStatus() {
    this.onlineStatus.next(navigator.onLine);
  }
}
