import { Component, OnInit } from '@angular/core';
import { OsmService } from '../services/osm.service';
import {Router} from '@angular/router'
import { Storage } from '@ionic/storage'
import { LoadingController, ModalController } from '@ionic/angular';
import {ChooseBoxComponent} from '../choose-box/choose-box.component'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private loginInformation;
  private boxes;
  private keepSignedIn: boolean

  constructor(
    private osem:OsmService,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  private async submitLogin(form) {
    try {
      // Try to login on success request data from all available boxes
      this.loginAndForward(form.value.email, form.value.password)
      this.keepSignedIn ?
        this.saveCredentials(form.value.email, form.value.password) :
        this.removeCredentials()
    }
    catch (err) {
      console.log(err);
    }
  }

  async presentModal(data) {
    const modal = await this.modalController.create({
      component: ChooseBoxComponent,
      componentProps: {
        data
      },
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  private async loginAndForward(email, password) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    })

    loading.present();
    this.osem.submitLogin(email, password)
      .subscribe((loginInformation) => {
        console.log(loginInformation);
        this.loginInformation = <any>loginInformation
        this.storage.set('token', this.loginInformation.token)
        this.storage.set('refreshToken', this.loginInformation.refreshToken)
        this.osem.getUserBoxes(this.loginInformation.token)
          .subscribe(boxes => {
            this.boxes = boxes
            // this.storage.set('login')
            loading.dismiss();
            this.presentModal(boxes);
            //this.router.navigate(['landing'])
          })
      },
        (error) => {
          console.error(error);
          loading.dismiss();
          console.log(error.message)
          //this.presentToastWithOptions(error.error.message);
        })

  }

  private saveCredentials(email: string, password: string) {
    // set password and email in internal storage 
    console.log("saving");
    this.storage.set('useremail', email)
    this.storage.set('userpw', password)
  }

  private removeCredentials() {
    console.log("removing credentials");
    this.storage.remove('useremail');
    this.storage.remove('userpw');
  }

}
