import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageReference } from '@angular/fire/storage/ref';
import { AngularFireStorage } from '@angular/fire/storage';



import { map } from 'rxjs/operators';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private storage: AngularFireStorage) { }

  async addProduct(product) {
    product.creator = (await this.afAuth.currentUser).uid;
    const imageData = product.img;
    delete product.img;

    let documentId = null;
    let storageRef: AngularFireStorageReference = null;

    return this.db.collection('products').add(product).then(ref => {
      console.log('ref: ', ref);
      documentId = ref.id;
      storageRef = this.storage.ref(`products/${documentId}`);
      const uploadTask = storageRef.putString(imageData, 'base64', { contentType: 'image/png'});
      return uploadTask;
    }).then(task => {
      console.log('task: ', task);
      return storageRef.getDownloadURL().toPromise();
    }).then(imageUrl => {
      console.log('got url: ', imageUrl);
      return this.db.doc(`products/${documentId}`).update({ img: imageUrl });
    });
  }

  getSellerProducts() {
    const id = firebase.auth().currentUser.uid;

    return this.db.collection(
      'products',
      ref => ref.where('creator', '==', id))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        // tslint:disable-next-line: no-shadowed-variable
        const id = a.payload.doc.id;
        return { id, ...data as {} };
      }))
    );
  }

  deleteProduct(id) {
    this.db.doc(`products/${id}`).delete();
    this.storage.ref(`products/${id}`).delete().subscribe(res => {});
  }
}
