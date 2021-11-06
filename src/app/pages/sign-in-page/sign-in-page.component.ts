import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from 'src/app/interfaces/user.model';

import { UserService } from '../../services/user.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit, OnDestroy {

  loggedInSubscription!: Subscription;
  usersSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.loggedInSubscription = this.userService.isLoggedIn().subscribe(loggedInUser => {
      if (!!loggedInUser) {
        this.router.navigate(['/home']);
      }
    });
  }

  onClickGoogleSignIn(): void {
    this.loggedInSubscription = this.userService.isLoggedIn().subscribe(loggedInUser => {
      if (!!loggedInUser) {
        let { displayName, email, photoURL, uid } = loggedInUser.multiFactor.user;

        // Default avatar in case the user does not have any
        if (photoURL === '') {
          photoURL = 'https://avatars.githubusercontent.com/u/39241600?v=4';
        }

        const user: User = {
          id: uid,
          name: displayName,
          email,
          photoURL
        };

        this.usersSubscription = this.userService.getUsers().subscribe(users => {
          const userExists = this.checkIfUserExists(user, users);
          if (!userExists) {
            this.userService.createUser(user);
          }
          this.router.navigate(['/home']);
        });
      }
    });
  }

  checkIfUserExists(user: User, users: User[]): boolean {
    const userFound = users.find(item => item.email === user.email);
    return userFound === undefined ? false : true;
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
