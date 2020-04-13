import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth/';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<any>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private navCtrl: NavController) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  signIn(credentials: { email: string; password: string; }): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password)).pipe(
      switchMap(user => {
        console.log('real user: ', user);
        if (user) {
          return this.db.doc(`users/${user.user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signUp(credentials: { email: string; password: string; name: any; role: any; }) {
    return await this.afAuth.
    createUserWithEmailAndPassword(credentials.email, credentials.password).then((data: { user: { uid: any; }; }) => {
      console.log('after register: ', data);
      return this.db.doc(`users/${data.user.uid}`).set({
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.navCtrl.navigateRoot('/');
    });
  }
}