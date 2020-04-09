import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: AngularFirestore) { }

  async signUp(credentials: { email: string; password: string; name: any; role: any; }) {
    return await firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password).then(data => {
      console.log('after register: ', data);
      return this.db.doc(`users/${data.user.uid}`).set({
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }
}
