import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canAccess(expectedRole: string[]): Observable<boolean> {
    //console.log('expectedRole::', expectedRole);
    return this.auth.user$.pipe(
      map((user) => {
        if (!user) {
          this.router.navigate(['/']);
          return false;
        }
        //console.log('user::', user);

        // Verifica que 'roles' sea un array o una cadena de texto
        let roles: string[] = [];
        const userRoles = user['https://woomi.bateriaswillard.com/roles'];
        if (Array.isArray(userRoles)) {
          roles = userRoles;
        } else if (typeof userRoles === 'string') {
          roles = [userRoles];
        }
        //console.log('roles::', roles);
        if (
          roles.length > 0 &&
          expectedRole.some((role) => roles.includes(role))
        ) {
          return true;
        }
        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}
