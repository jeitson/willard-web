import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const storage = inject(StorageService);
  return auth.isAuthenticated$.pipe(
    map((loggedIn) => {
      if (!loggedIn) {
        //const state = this.route.snapshot;
        //auth.loginWithPopup()
        auth.loginWithRedirect({ appState: { target: state.url } });
        return false;
      } else {
        const hasReloaded = storage.getHasReloaded;
        if (!hasReloaded) {
          storage.setHasReloaded(true);
          window.location.reload();
          return false; // Prevent further processing until reload is complete
        }
      }
      return true;
    })
  );
};
