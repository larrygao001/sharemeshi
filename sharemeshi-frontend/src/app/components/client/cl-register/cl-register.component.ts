import { Component, OnInit, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, TemplateRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { cl_usertypes , cl_reason } from '../../../const/cl-usertype';
import { cl_ages } from '../../../const/cl-age';
import { cl_genders } from '../../../const/cl-gender';
import { cl_profession } from '../../../const/cl-profession';
import { cl_status } from '../../../const/cl-status';
import { cl_configs } from '../../../config/cl-config';
import { Router } from '@angular/router';

import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { NotificationService } from '../../../services/notification.service';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { environment } from '../../../../environments/environment';

import { ClFoodService } from '../../../services/client/cl-food.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cl-register',
  templateUrl: './cl-register.component.html',
  styleUrls: ['./cl-register.component.css']
})

export class ClRegisterComponent implements OnInit {



  model: any = {};
  form_data: FormData;

  loadTemplate: string = cl_configs.loadgif;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private authService: ClAuthenticationService,
    private router: Router,
    private notification: NotificationService,
    private modalService: BsModalService,
    private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    private foodService: ClFoodService) {

    }

  ngOnInit() {
    this.foodService.setMenuItemActive('#nitem11');
  }

  doRegister() {

    this.form_data = new FormData();

    if (this.model.password !== this.model.password_confirm)
    {
      this.notification.showNotification('Error', 'パスワードが一致しません', 'error');
    }
    else
    {
      if(this.model.password.length < 6)
      {
        this.notification.showNotification('Error', 'パスワードは6文字以上に設定してください' , 'error');
      }
      else
      {
        for (let key in this.model) {
          this.form_data.append(key, this.model[key]);
        }

        console.log("ffmodel : " + this.form_data.get('email'));

        this.ng4LoadingSpinnerService.show();

        this.authService.register(this.form_data).subscribe(data => {

          this.ng4LoadingSpinnerService.hide();
          console.log('reg : ' + JSON.stringify(data));
          if(data.result === true)
            {
              this.notification.showNotification('Success', '入力したメールアドレスに認証メールを送信しました。', 'success');
              this.router.navigate(['/singin']);
            }
          if(data.result === false)
          {
              for (var key in data.message) {
                this.notification.showNotification(key, data.message[key], 'error');
              }
          }
        }, err => {
          console.log('error2');
        });

        console.log(JSON.stringify(this.model));

      }
    }
  }

}
