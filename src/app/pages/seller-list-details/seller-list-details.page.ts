import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { NavController } from '@ionic/angular';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-seller-list-details',
  templateUrl: './seller-list-details.page.html',
  styleUrls: ['./seller-list-details.page.scss'],
})
export class SellerListDetailsPage implements OnInit {

  productForm: FormGroup;
  photo: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      desc: ['', Validators.required],
      img: ''
    });
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }

  createProduct() {
    this.productService.addProduct(this.productForm.value).then(res => {
      this.navCtrl.pop();
    });
  }

}
