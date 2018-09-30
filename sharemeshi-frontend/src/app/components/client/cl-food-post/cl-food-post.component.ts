import { Component, OnInit, NgZone, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { cl_food_category } from '../../../const/cl-food-category';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import { cl_configs } from '../../../config/cl-config';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { jaLocale } from 'ngx-bootstrap/locale';
defineLocale('ja', jaLocale);

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-cl-food-post',
  templateUrl: './cl-food-post.component.html',
  styleUrls: ['./cl-food-post.component.css']
})
export class ClFoodPostComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  model: any = {};
  categories: any;

  public selectedMoment: Date;

  fImgBlobArray: any = [];
  fImgSrcArray: any = [];
  tempImg: any;

  @ViewChild('productImages') productImages: ElementRef;

  FimageData: any;
  FimagecropperSettings: CropperSettings;
  @ViewChild('Fimagecropper', undefined)
  Fimagecropper: ImageCropperComponent;

  bsConfigdata: any = { dateInputFormat: 'YYYY-MM-DD', containerClass: 'theme-orange', showWeekNumbers: false };

  modalRef: BsModalRef;

  mytimer: number;

  food_categories: any = [];

  constructor(private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
              private foodService: ClFoodService,
              private router: Router,
              private notification: NotificationService,
              private localeService: BsLocaleService,
              private modalService: BsModalService) {

              this.FimagecropperSettings = new CropperSettings();
              this.FimagecropperSettings.noFileInput = true;
              this.FimagecropperSettings.width = 110;
              this.FimagecropperSettings.height = 60;
              this.FimagecropperSettings.croppedWidth = 1100;
              this.FimagecropperSettings.croppedHeight = 600;
              this.FimagecropperSettings.canvasWidth = 300;
              this.FimagecropperSettings.canvasHeight = 200;
              this.FimageData = {};
  }

  ngOnInit() {

    this.foodService.setMenuItemActive('#nitem5');

    // disable mousewheel on a input number field when in focus
    // (to prevent Cromium browsers change the value when scrolling)
    $('form').on('focus', 'input[type=number]', function (e) {
      $(this).on('mousewheel.disableScroll', function (e) {
        e.preventDefault();
      });
    });
    $('form').on('blur', 'input[type=number]', function (e) {
      $(this).off('mousewheel.disableScroll');
    });

    this.foodService.getFoodCategories().subscribe(data => {
      console.log('f category : ' + JSON.stringify(data));
      this.food_categories = data.data;

        $('.start_public_time').datetimepicker({ format: 'HH:mm', stepping: 30 });
        $('.end_public_time').datetimepicker({ format: 'HH:mm', stepping: 30 });
        this.model.start_publication_time_temp = '';
        this.model.end_publication_time_temp = '';

        this.localeService.use('ja');

        this.categories = cl_food_category;

        this.model.category_id = '';

        let today = new Date();
        let myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0, 0);

        this.model.titems = [];
        this.model.date_of_delivery = '';

        let clientData = JSON.parse(localStorage.getItem('clientUser'));
        this.model.deliverable_area = clientData.profile.deliverable_area;

        this.addSlot();
    }, err => {
      console.log(err);
    });

  }

  openTimeModal(template: TemplateRef<any>) {
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


  splice(data , idx, rem, str) {
    return data.slice(0, idx) + str + data.slice(idx + Math.abs(rem));
  }

  doPrepare() {
    if(this.fImgBlobArray.length != 0)
    {
      this.ng4LoadingSpinnerService.show();

      let todayDT = new Date();

      this.model.date_of_availability = this.model.date_of_delivery_temp.getFullYear() + '-' + (this.model.date_of_delivery_temp.getMonth() + 1) + '-' +  this.model.date_of_delivery_temp.getDate();

      this.model.start_publication_date = todayDT.getFullYear() + '-' + (todayDT.getMonth() + 1) + '-' + todayDT.getDate();
      this.model.end_publication_date = this.model.end_publication_date_temp.getFullYear() + '-' + (this.model.end_publication_date_temp.getMonth() + 1) + '-' + this.model.end_publication_date_temp.getDate();
      this.model.start_publication_time = todayDT.getHours() + ':' +  todayDT.getMinutes() + ':00';
      this.model.end_publication_time = this.model.end_publication_time_temp + ':00';

      console.log(this.model.date_of_availability);

      this.model.start_time = [];
      this.model.end_time = [];
        for (let i = 0; i < this.model.titems.length; i++)
        {

          this.model.start_time.push(this.model.titems[i].start_time_temp + ':00');
           console.log(this.model.start_time);

          this.model.end_time.push(this.model.titems[i].end_time_temp + ':00');
          console.log(this.model.end_time);
        }

        let form_data = new FormData();
        for (let key in this.model) {
          if(key != 'titems' && key != 'images' && key != 'date_of_delivery_temp' &&
            key != 'start_publication_date_temp' && key != 'start_publication_time_temp' &&
            key != 'end_publication_date_temp' && key != 'end_publication_time_temp' &&
            key != 'date_of_delivery')
            {
              form_data.append(key, this.model[key]);
            }
        }
        /*let imagesObj = this.productImages.nativeElement;
        if (imagesObj.files && imagesObj.files[0]) {
          for (let ifile of imagesObj.files) {
            form_data.append('food_images[]', ifile, ifile.name);
          }
        }*/
        for (let ifile of this.fImgBlobArray) {
          form_data.append('food_images[]', ifile, ifile.name);
        }

        this.doregisterFood(form_data);
      }
      else
      {
        this.notification.showNotification('Failed' , 'お料理画像は必ず登録してください', 'error');
      }
  }

  doregisterFood(fd) {
    this.foodService.createFood(fd).subscribe(data => {
      console.log('reg : ' + JSON.stringify(data));
      this.ng4LoadingSpinnerService.hide();

      if(data.result === false)
      {
        if(data.flag === '3')
        {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        this.notification.showNotification('Failed', data.message, 'error');
      }
      else
      {
        this.notification.showNotification('Success', 'お料理を登録しました', 'success');
        this.router.navigate(['/food-management']);
      }
    }, err => {
      console.log('error2');
    });
  }

  setTimepickers() {
    for(let i = 0; i < this.model.titems.length; i++)
    {
      console.log("#startTime" + i);
      $('#startTime' + i).datetimepicker({ format: 'HH:mm', stepping: 30 });
      $('#endTime' + i).datetimepicker({ format: 'HH:mm', stepping: 30 });
    }
  }

  addSlot() {
    let today = new Date();
    let myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0, 0);

    this.model.titems.push({ start_time_temp: '', end_time_temp: '' });

    this.mytimer = setTimeout(() => {
      this.setTimepickers();
    }, 100);

  }

  closeSlot(index) {
    if(this.model.titems.length > 1)
    {
      this.model.titems.splice(index, 1);
    }
  }

  readUrl(event: any) {
    let image: any = new Image();
    let file: File = event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.Fimagecropper.setImage(image);

    };

    this.tempImg = file;

    myReader.readAsDataURL(file);

  }

  removeImg(rindex) {
    this.fImgBlobArray.splice(rindex, 1);
    this.fImgSrcArray.splice(rindex, 1);
  }

  saveImg() {

    if(this.FimageData.image) {
      let faimg = this.convertToBlob(this.FimageData.image);

      this.fImgBlobArray.push(faimg);
      this.fImgSrcArray.push(this.FimageData.image);
    }

  }

  publicTimeChanged(type)
  {
    if(type == 0)
    {
      this.model.start_publication_time_temp = $('.start_public_time').val();
    }
    if (type == 1) {
      this.model.end_publication_time_temp = $('.end_public_time').val();
    }
  }
  periodTimeChanged(type)
  {
    console.log('pt : ' + type);
    if((type >= 100) && (type < 200))
    {
      this.model.titems[type - 100].start_time_temp = $('#startTime' + (type - 100)).val();
    }
    if (type >= 200) {
      this.model.titems[type - 200].end_time_temp = $('#endTime' + (type - 200)).val();
    }
  }

}
