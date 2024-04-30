import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStateService } from "../services/app-state.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private appState: AppStateService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appState.authState.isAuthenticated) {
      return true; // Authentifié, autoriser l'accès à la route
    } else {
      this.router.navigateByUrl("/login"); // Rediriger vers la page de connexion
      return false; // Ne pas autoriser l'accès à la route
    }
  }
}
