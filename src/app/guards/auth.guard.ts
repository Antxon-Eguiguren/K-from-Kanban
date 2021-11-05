import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../services/user.service';

import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {

  subscription!: Subscription;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): boolean {
    this.subscription = this.userService.isLoggedIn().subscribe(loggedInUser => {
      if (loggedInUser === null) {
        this.router.navigate(['/sign-in']);
      }
    });

    return true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
