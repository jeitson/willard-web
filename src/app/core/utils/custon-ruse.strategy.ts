import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false; // No se almacena la ruta
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {}

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false; // No se reutiliza ninguna ruta almacenada
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null; // No devuelve ningún handle almacenado
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Verificamos si future.routeConfig y curr.routeConfig no son null
    if (future.routeConfig && curr.routeConfig) {
      // Comparamos las rutas y evitamos la reutilización para la ruta específica 'tu-ruta'
      return future.routeConfig === curr.routeConfig && future.routeConfig.path !== 'tu-ruta';
    }
    // Si alguna de las rutas es null, no reutilizamos
    return false;
  }

}
