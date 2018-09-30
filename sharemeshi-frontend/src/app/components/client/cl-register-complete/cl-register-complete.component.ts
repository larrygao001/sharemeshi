import { Component, OnInit, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, TemplateRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { cl_usertypes, cl_reason } from '../../../const/cl-usertype';
import { cl_ages } from '../../../const/cl-age';
import { cl_genders } from '../../../const/cl-gender';
import { cl_profession } from '../../../const/cl-profession';
import { cl_status } from '../../../const/cl-status';
import { Router, ActivatedRoute } from '@angular/router';
import { cl_configs } from '../../../config/cl-config';

import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';

import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { NotificationService } from '../../../services/notification.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { ClFoodService } from '../../../services/client/cl-food.service';

import { environment } from '../../../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cl-register-complete',
  templateUrl: './cl-register-complete.component.html',
  styleUrls: ['./cl-register-complete.component.css']
})
export class ClRegisterCompleteComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  r_usertype: any;
  r_reason: any;
  r_age: any;
  r_gender: any;
  r_profession: any;
  r_status: any;

  model: any = {};
  form_data: FormData;

  fusertype: any = false;

  reg_uid: any;



  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private authService: ClAuthenticationService,
    private router: Router,
    private notification: NotificationService,
    private activatedRouter: ActivatedRoute,
    private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    private foodService: ClFoodService) {

  }

  ngOnInit() {

    this.foodService.setMenuItemActive('#nitem11');

    this.activatedRouter.params.subscribe(params => {
      let uid = params['uid'];
      if (uid) {

        this.reg_uid = uid;
        console.log('reguid : ' + this.reg_uid);


        this.r_usertype = cl_usertypes;
        this.r_gender = cl_genders;
        this.r_profession = cl_profession;
        this.r_age = cl_ages;

        this.model.usertype = '';
        this.model.gender = '';
        this.model.profession = '';
        this.model.age = '';

        this.model.country = 'Japan';
        this.model.lat = 1;
        this.model.long = 1;

        /*this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          });
          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              // get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();

              // verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }

              console.log(place);

              let componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name',
                country: 'long_name',
                postal_code: 'short_name'
              };

              for (let i = 0; i < place.address_components.length; i++) {
                let addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                  let val = place.address_components[i][componentForm[addressType]];
                  if (addressType === 'locality') {
                    this.model.municipality = val;
                  }
                  if (addressType === 'postal_code') {
                    this.model.zipcode = val;
                  }
                  if (addressType === 'country') {
                    this.model.country = val;
                  }
                }
              }

              // set latitude, longitude and zoom
              this.model.lat = place.geometry.location.lat();
              this.model.long = place.geometry.location.lng();
              this.model.address = place.formatted_address;
              // this.zoom = 12;
            });
          });
        });*/
      }
    });

  }

  doRegister() {

    if(this.fusertype === true)
    {
      this.model.type = 0;
    }
    else
    {
      this.model.type = 1;
    }

    this.model.user_id = this.reg_uid;

    this.form_data = new FormData();

    for (let key in this.model) {
        this.form_data.append(key, this.model[key]);
    }


    console.log("tdata : " + JSON.stringify(this.model));

    this.ng4LoadingSpinnerService.show();

    this.authService.register_complete(this.form_data).subscribe(data => {

          this.ng4LoadingSpinnerService.hide();

          console.log('regooo : ' + JSON.stringify(data));
          if (data.result === true) {
            this.notification.showNotification('Success', 'プロフィールを登録しました', 'success');

            data.profile['password'] = data.user.new_password;
            data.profile['password_confirmation'] = data.user.new_password_confirmation;

            this.authService.setUserData(data).subscribe(userData => {
              let ud = JSON.parse(localStorage.getItem('clientUser'));
              console.log('111111storage data : ' + JSON.stringify(ud));

              this.foodService.setHeaderCartNum();
              this.router.navigate(['/register-additional/' + ud.user.user_id + '/' + ud.user.type]);
            });

          }
          if (data.result === false) {
            for (var key in data.message) {
              this.notification.showNotification(key, data.message[key], 'error');
            }
          }
        }, err => {
          console.log('error2');
        });
  }

  onChangeUserType(val) {
    this.model.reason = [];

    console.log(val);
  }

}
