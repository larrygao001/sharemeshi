import { Component, OnInit, NgZone, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, TemplateRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { cl_usertypes, cl_reason } from '../../../const/cl-usertype';
import { cl_ages } from '../../../const/cl-age';
import { cl_genders } from '../../../const/cl-gender';
import { cl_profession } from '../../../const/cl-profession';
import { cl_status } from '../../../const/cl-status';
import { cl_configs } from '../../../config/cl-config';
import { Router, ActivatedRoute } from '@angular/router';

import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';

import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { NotificationService } from '../../../services/notification.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { environment } from '../../../../environments/environment';

import { ClFoodService } from '../../../services/client/cl-food.service';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-cl-register-additional',
  templateUrl: './cl-register-additional.component.html',
  styleUrls: ['./cl-register-additional.component.css']
})
export class ClRegisterAdditionalComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  model: any = {};
  form_data: FormData;

  avatarUrl: any = '';
  backgroundUrl: any = '';

  modalRef: BsModalRef;

  utype: any;

  @ViewChild('avatarInput') avatarInput: ElementRef;
  @ViewChild('bgInput') bgInput: ElementRef;

  Avatardata: any;
  AvatarcropperSettings: CropperSettings;
  @ViewChild('cropper', undefined)
  Avatarcropper: ImageCropperComponent;

  Bgdata: any;
  BgcropperSettings: CropperSettings;
  @ViewChild('Bgcropper', undefined)
  Bgcropper: ImageCropperComponent;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private authService: ClAuthenticationService,
    private router: Router,
    private notification: NotificationService,
    private modalService: BsModalService,
    private activatedRouter: ActivatedRoute,
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

    this.foodService.setMenuItemActive('#nitem11');

    this.activatedRouter.params.subscribe(params => {
      let uid = params['uid'];
      let utype = params['utype'];
      if(uid && utype)
      {
        console.log(uid);
        console.log(utype);
        this.utype = utype;

        this.model.user_id = uid;
      }
    });

  }

  goToLogin()
  {
    this.router.navigate(['/profile']);
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

  rotateBase64Image(base64ImageSrc) {
    let canvas = document.createElement('canvas');
    let img = new Image();
    img.src = base64ImageSrc;
    canvas.width = img.width;
    canvas.height = img.height;
    let context = canvas.getContext("2d");
    context.translate(img.width, img.height);
    context.rotate(180 * Math.PI / 180);
    context.drawImage(img, 0, 0);
    return canvas.toDataURL();
  }

  doRegister() {

    this.form_data = new FormData();
    let avatarFi = this.avatarInput.nativeElement;
    let bgFi = this.bgInput.nativeElement;

    if (this.Avatardata.image) {
      console.log('aexist');
      let aimg = this.convertToBlob(this.Avatardata.image);
      this.form_data.append('image', aimg);
    }
    if (this.Bgdata.image) {
      console.log('bexist');
      let bimg = this.convertToBlob(this.Bgdata.image);
      this.form_data.append('cover_image', bimg);
    }

    if (this.model.password !== this.model.password_confirm) {
      this.notification.showNotification('Error', 'パスワードが一致しません', 'error');
    }

    for (let key in this.model) {
      this.form_data.append(key, this.model[key]);
    }

    this.ng4LoadingSpinnerService.show();

    this.authService.register_additional(this.form_data).subscribe(data => {

          this.ng4LoadingSpinnerService.hide();

          console.log('reg : ' + JSON.stringify(data));
          if (data.result === true) {
            this.notification.showNotification('Success', 'プロフィールを登録しました', 'success');

            let current_userdata = JSON.parse(localStorage.getItem('clientUser'));
            current_userdata.profile.image = data.data.image;
            current_userdata.profile.cover_image = data.data.cover_image;
            current_userdata.profile.deliverable_area = this.model.deliverable_area;
            localStorage.setItem('clientUser', JSON.stringify(current_userdata));

            this.router.navigate(['/profile']);
          }
          if (data.result === false) {
            for (var key in data.message) {
              this.notification.showNotification(key, data.message[key], 'error');
            }
          }
        }, err => {
          console.log('error2');
        });

        console.log(JSON.stringify(this.model));

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

      };

      myReader.readAsDataURL(file);

      $('#myBgModal').modal('show');
    }

  }

}
