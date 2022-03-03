import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
})
export class SignInPageComponent implements OnInit, OnDestroy {
  loggedInSubscription!: Subscription;
  usersSubscription!: Subscription;
  phoneSignIn = false;

  constructor(
    private userService: UserService,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.loggedInSubscription = this.userService
      .isLoggedIn()
      .subscribe((loggedInUser) => {
        if (loggedInUser) {
          this.router.navigate(['/home']);
        }
      });
  }

  togglePhoneSignIn(): void {
    this.phoneSignIn = !this.phoneSignIn;
  }

  ngOnDestroy(): void {
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }

    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
