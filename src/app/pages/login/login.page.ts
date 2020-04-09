import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
    }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      role: ['BUYER', Validators.required]
    });
  }

  async register() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await loading.present();

    this.authService.signUp(this.registerForm.value).then(async res => {
      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Successfully created new Account!'
      });
      toast.present();

      console.log('finished: ', res);
    }, async err => {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
      alert.present();
    }
    );
  }
}
