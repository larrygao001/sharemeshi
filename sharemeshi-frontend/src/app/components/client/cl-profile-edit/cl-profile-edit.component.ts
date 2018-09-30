import { Component, OnInit, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, TemplateRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { cl_usertypes, cl_reason } from '../../../const/cl-usertype';
import { cl_ages } from '../../../const/cl-age';
import { cl_genders } from '../../../const/cl-gender';
import { cl_profession } from '../../../const/cl-profession';
import { cl_status } from '../../../const/cl-status';
import { cl_configs } from '../../../config/cl-config';
import { Router } from '@angular/router';

import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { NotificationService } from '../../../services/notification.service';
import { ClUserService } from '../../../services/client/cl-user.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { environment } from '../../../../environments/environment';

import { ClFoodService } from '../../../services/client/cl-food.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cl-profile-edit',
  templateUrl: './cl-profile-edit.component.html',
  styleUrls: ['./cl-profile-edit.component.css']
})

export class ClProfileEditComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  r_usertype: any;
  r_reason: any;
  r_age: any;
  r_gender: any;
  r_profession: any;
  r_status: any;

  model: any = {};
  form_data: FormData;
  reasonflag: any = '';

  avatarUrl: any = '';
  backgroundUrl: any = '';

  modalRef: BsModalRef;

  @ViewChild('search')
  public searchElementRef: ElementRef;
  @ViewChild('avatarInput') avatarInput: ElementRef;
  @ViewChild('bgInput') bgInput: ElementRef;

  @ViewChild('template') mytemplate: TemplateRef<any>;
  @ViewChild('Bgtemplate') myBgtemplate: TemplateRef<any>;

  Avatardata: any;
  AvatarcropperSettings: CropperSettings;
  @ViewChild('cropper', undefined)
  Avatarcropper: ImageCropperComponent;
  AvatarcropperDone = 0;

  Bgdata: any;
  BgcropperSettings: CropperSettings;
  @ViewChild('Bgcropper', undefined)
  Bgcropper: ImageCropperComponent;
  BgcropperDone = 0;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private authService: ClAuthenticationService,
    private router: Router,
    private notification: NotificationService,
    private userService: ClUserService,
    private modalService: BsModalService,
    private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    private foodService: ClFoodService) {

      this.AvatarcropperSettings = new CropperSettings();
      this.AvatarcropperSettings.noFileInput = true;
      this.AvatarcropperSettings.width = 200;
      this.AvatarcropperSettings.height = 200;
      this.AvatarcropperSettings.croppedWidth = 200;
      this.AvatarcropperSettings.croppedHeight = 200;
      this.AvatarcropperSettings.rounded = true;
      this.Avatardata = {};

      this.BgcropperSettings = new CropperSettings();
      this.BgcropperSettings.noFileInput = true;
      this.BgcropperSettings.width = 110;
      this.BgcropperSettings.height = 60;
      this.BgcropperSettings.croppedWidth = 1100;
      this.BgcropperSettings.croppedHeight = 600;
      this.Bgdata = {};

  }

  ngOnInit() {

    this.foodService.setMenuItemActive('');

    this.r_usertype = cl_usertypes;
    this.r_reason = cl_reason;
    this.r_gender = cl_genders;
    this.r_profession = cl_profession;

    let userData = JSON.parse(localStorage.getItem('clientUser'));
    this.model = userData.profile;

    if(this.model.image)
      this.Avatardata.image = environment.base_url + '/' + this.model.image;
    if (this.model.cover_image)
      this.Bgdata.image = environment.base_url + '/' +this.model.cover_image;

    this.model.name = userData.user.name;
    this.model.nick_name = userData.user.nick_name;
    this.model.type = userData.user.type;

    this.model.prefecture = this.model.prefectures;

    // let tempReasons = this.model.reason.split(',');

    // this.onChangeUserType(this.model.usertype);

    /*this.model.usertype = '';
    this.model.gender = '';
    this.model.reason = [];
    this.model.job = '';*/

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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  b64toBlob(b64Data, contentTyper) {
    let contentType = contentTyper || '';
    let sliceSize = 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  convertToBlob(bsdata) {
    console.log('bsdata : ' + bsdata);
    // Split the base64 string in data and contentType
    let block = bsdata.split(";");
    // Get the content type of the image
    let contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    let realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    let blob = this.b64toBlob(realData, contentType);

    return blob;
  }


  doProfileUpdate() {

    this.ng4LoadingSpinnerService.show();

    this.form_data = new FormData();
    let avatarFi = this.avatarInput.nativeElement;
    let bgFi = this.bgInput.nativeElement;

    delete this.model.image;
    delete this.model.cover_image;

    if (this.AvatarcropperDone !== 0) {
      console.log('aexist');
      let aimg = this.convertToBlob(this.Avatardata.image);
      this.form_data.append('image', aimg);
    }
    if (this.BgcropperDone !== 0) {
      console.log('bexist');
      let bimg = this.convertToBlob(this.Bgdata.image);
      this.form_data.append('cover_image', bimg);
    }

    if (this.model.password && this.model.password_confirmation)
    {
      if (this.model.password !== this.model.password_confirmation) {
          this.ng4LoadingSpinnerService.hide();
          this.notification.showNotification('Error', 'パスワードが一致しません', 'error');
        }
        else {
          if (this.model.password.length < 6) {
            this.ng4LoadingSpinnerService.hide();
            this.notification.showNotification('Error', 'パスワードは6文字以上に設定してください', 'error');
          }
          else {
            this.doMainUpdate();
          }
        }
    }
    else
    {
      console.log('emptypassword');
      this.doMainUpdate();
    }
  }

  doMainUpdate()
  {

    delete this.model.id;
    delete this.model.profile_message;
    delete this.model.state;
    delete this.model.verification_code;
    delete this.model.verified;
    delete this.model.status;
    delete this.model.created_at;
    delete this.model.updated_at;

    console.log("qqrrqqffmodel : " + JSON.stringify(this.model));

    for (let key in this.model) {
      if (this.model[key] != null)
        this.form_data.append(key, this.model[key]);
    }

    console.log("qqffmodel : " + this.form_data.get('email'));

    this.authService.updateProfile(this.form_data).subscribe(data => {

      console.log('reg : ' + JSON.stringify(data));
      this.ng4LoadingSpinnerService.hide();

      if (data.result === true) {
        this.notification.showNotification('Success', '更新しました', 'success');

        let pformdata = new FormData();
        let sessionUser = JSON.parse(localStorage.getItem('clientUser'));
        pformdata.append('password' , this.form_data.get('password'));
        pformdata.append('email' , sessionUser.user.email);
        this.doUpdateSession(pformdata);

      }
      if (data.result === false) {

        if (data.flag === '3') {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        for(let key in data.message)
          this.notification.showNotification(key, data.message[key], 'error');
      }
    }, err => {
      console.log('error2');
    });

    console.log(JSON.stringify(this.model));
  }

  doUpdateSession(pformdata) {
    // console.log('login : ' + JSON.stringify(this.model));

    this.authService.login(pformdata).subscribe(userAuthenticate => {
      console.log('aa : ' + JSON.stringify(userAuthenticate));
      if (userAuthenticate.result === true) // login info correct
      {
        userAuthenticate.profile.password = pformdata.get('password');
        userAuthenticate.profile.password_confirmation = pformdata.get('password');

        this.authService.setUserData(userAuthenticate).subscribe(userData => {
          let ud = JSON.parse(localStorage.getItem('clientUser'));
          console.log('111111storage data : ' + JSON.stringify(ud));
          this.router.navigate(['/profile']);
        });

      } else {
        this.notification.showNotification('Failed', userAuthenticate.message, 'error');
        if (userAuthenticate.flag === '2')
          this.router.navigate(['client/register-complete/' + userAuthenticate.data.user_id]);

      }
    }, err => {
      console.log('error2');
    });
  }

  onChangeUserType(val) {
    this.reasonflag = val;
    this.model.reason = [];

    console.log(val);
  }

  onChangeReason(id, checked) {
    if (checked) {
      this.model.reason.push(id);
    }
    else {
      this.removeReason(id);
    }
  }

  removeReason(doc) {
    this.model.reason.forEach((item, index) => {
      if (item === doc) {
        this.model.reason.splice(index, 1);
      }
    });
  }

  readUrl(event: any, type: any) {

    if (type === 1) {
      let image: any = new Image();
      let file: File = event.target.files[0];
      let myReader: FileReader = new FileReader();
      let that = this;
      myReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        that.Avatarcropper.setImage(image);
        that.AvatarcropperDone = 1;

      };

      myReader.readAsDataURL(file);

      $('#myModal').modal('show');
    }
    else {
      let image: any = new Image();
      let file: File = event.target.files[0];
      let myReader: FileReader = new FileReader();
      let that = this;
      myReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        that.Bgcropper.setImage(image);
        that.BgcropperDone = 1;

      };

      myReader.readAsDataURL(file);

      $('#myBgModal').modal('show');
    }
    /*
    if (event.target.files && event.target.files[0]) {
      // let file = event.target.files[0];
      let reader = new FileReader();

      reader.onload = (event: any) => {
        if (type === 1) {
          // this.form_data.append('image' , file);
          this.avatarUrl = event.target.result;
        }
        else {
          // this.form_data.append('bg_image', file);
          this.backgroundUrl = event.target.result;
        }
      }

      reader.readAsDataURL(event.target.files[0]);
    }*/
  }


}
