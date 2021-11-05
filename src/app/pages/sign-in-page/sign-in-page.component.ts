import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from 'src/app/interfaces/user.model';

import { UserService } from '../../services/user.service';

import { of, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnDestroy {

  loggedInSubscription!: Subscription;
  usersSubscription!: Subscription;
  userExistSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {}

  onClickGoogleSignIn(): void {
    this.loggedInSubscription = this.userService.isLoggedIn().subscribe(loggedInUser => {
      if (!!loggedInUser) {
        let { displayName, email, photoURL, uid } = loggedInUser.multiFactor.user;

        if (photoURL === '') {
          photoURL = 'fdsfds';
        }

        const user: User = {
          id: uid,
          name: displayName,
          email,
          photoURL
        };

        this.userExistSubscription = this.checkIfUserExists(user).subscribe(userExists => {
          if (!userExists) {
            console.log('crea user');
            this.userService.createUser(user);
          }
        });

        this.router.navigate(['/home']);
      }
    });
  }

  checkIfUserExists(user: User): Observable<boolean> {
    let userFound: boolean = false;

    this.usersSubscription = this.userService.getUsers().subscribe(users => {
      console.log(users);
      users.forEach(item => {
        if (item.email === user.email) {
          userFound = true;
        }
      });
    });

    return of(userFound);
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.userExistSubscription.unsubscribe();
  }

}
