import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Device } from '@capacitor/device';
import { SharedService } from './services/shared.service';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  idleLogoutTimer: any;
  PushPermission = '';
  PushToken = '';
  constructor(
    private shared:SharedService,
    private alertController:AlertController,
    private modalCtrl:ModalController,
    private router: Router,
    private platform: Platform,
    private apiService: ApiService,
    private changeRef: ChangeDetectorRef,
    ) {


    const logDeviceInfo = async () => {
      // const info = await Device.getInfo();
    const deviceid = await Device.getId();
    this.shared.CLIENT_IP = deviceid.identifier
    };

    logDeviceInfo();
  }


  ngOnInit() {
    this.isUserExist();
    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        if (this.router.url === '/login') {
          return false;
        }
      });
    });
  }



  restartIdleLogoutTimer() {
    clearTimeout(this.idleLogoutTimer);
    this.idleLogoutTimer = setTimeout(async () => {
      const popover = await this.modalCtrl.getTop();
      if (popover){ this.modalCtrl.dismiss(); }
      this.router.navigate(['login'], { replaceUrl: true });
      this.changeRef.detectChanges();
    }, 300000);
  }

  // registerPublicToken(token){
  //     let request = {
  //       params: { DeviceToken : token  },
  //       action_url: 'PublicSubscribe',
  //       method: 'post',
  //       serviceType: 'notify',
  //     };
  //     this.apiService.registerNotification(request).subscribe(
  //       async (resp: any) => {
  //         console.log('registerNotification resp', resp)
  //       },
  //       (error) => {
  //         console.log('error', error)
  //       }
  //     );
  // }
  
  @HostListener('touchstart')
  onTouchStart() {
    this.isUserExist();
  }

  isUserExist(){
    let isUserExists: any = localStorage.getItem('user') ? localStorage.getItem('user') : '';
    if (isUserExists) {
      this.restartIdleLogoutTimer();
    }

  }
}
