import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from '../interfaces/user.model';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  getUsers(): Observable<User[]> {
    return this.db.collection<User>('users').valueChanges();
  }

  createUser(user: User): void {
    this.db.collection<User>('users').add(user);
  }

  isLoggedIn(): Observable<any> {
    return this.afAuth.authState;
  }

}
