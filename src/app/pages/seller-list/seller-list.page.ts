import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.page.html',
  styleUrls: ['./seller-list.page.scss'],
})
export class SellerListPage implements OnInit {
  products: Observable<any>;

  constructor(private auth: AuthService, private productService: ProductService) { }

  ngOnInit() {
    this.products = this.productService.getSellerProducts();
  }

  delete(id) {
    this.productService.deleteProduct(id);
  }

  signOut() {
    this.auth.signOut();
  }

}
