import { Component, OnInit } from '@angular/core';
import { ClUserService } from '../../../services/client/cl-user.service';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';
import { cl_configs } from '../../../config/cl-config';
// import { DomSanitizationService } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { cl_foodstatus } from '../../../const/cl-foodstatus';
import { cl_food_category } from '../../../const/cl-food-category';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';

import { TitleService } from '../../../services/client/cl-title.service';

import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-cl-profile',
  templateUrl: './cl-profile.component.html',
  styleUrls: ['./cl-profile.component.css']
})
export class ClProfileComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  userInfo: any = {image: [''] , bg_image: ['']};
  userAdditionalInfo: any = {};
  conf: any = cl_configs;

  videoUrl: any;

  page: any = 0;
  reviewDatas: any = [];
  current_rDatas: any = [];

  fmdatas: any = [];
  base_url: any = environment.base_url;

  total_average: any = 0;

  total_reviews: any;

  constructor(private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
              private userService: ClUserService,
              private notification: NotificationService,
              private router: Router,
              public sanitizer: DomSanitizer,
              private foodService: ClFoodService,
              private mytitle: TitleService) { }

  ngOnInit() {

    this.foodService.setMenuItemActive('#nitem4');

    console.log('gege-logined');

    this.ng4LoadingSpinnerService.show();

    let sessionUser = JSON.parse(localStorage.getItem('clientUser'));
    this.userService.getUser(sessionUser.user.user_id).subscribe(data => {

      if (data.result === true) {
        this.ng4LoadingSpinnerService.hide();
        
        this.userInfo = data.data;
        console.log("mydata : " + JSON.stringify(this.userInfo));
        localStorage.setItem('pnickname', this.userInfo.nick_name);
        this.mytitle.setTitle(1);
        
        let str = this.userInfo.video_link;
        console.log('tonton : ' + str);
        if(str != null)
        {
          if(str.includes('watch?v='))
            str = str.replace('watch?v=', 'embed/');
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(str);

          $('<iframe>')                      // Creates the element
            .attr('src', str) // Sets the attribute spry:region="myDs"
            .attr('height', '480')
            .attr('width', '100%')
            .appendTo('#iframe_div');
        }
  
        this.loadReviews();
      }
      if (data.result === false) {
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {
      console.log('error2');
    });

  }

  loadReviews() {

    this.page += 1;
    console.log('num review1 : ' + this.userInfo.user_id + ' / ' + this.page);
    this.userService.getReviews({ user_id: this.userInfo.user_id, page: this.page, per_page: 5 }).subscribe(data => {
      console.log("reviews list1 : " + JSON.stringify(data));
      // this.ng4LoadingSpinnerService.hide();

      if (data.result === true) {

        this.total_reviews = data.data.total;

        this.current_rDatas = data.data.data;
        for(let i=0; i<data.data.data.length; i++)
          this.reviewDatas.push(data.data.data[i]);
        
        if(this.checkUserType)
          this.loadSchedules();

      }
      else {
        /*if (data.flag === '3') {
          localStorage.removeItem('clientUser');
          this.notification.showNotification('Failed', 'token expired', 'error');
          this.router.navigate(['/']);
        }*/
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {
      console.log('err');
    });
  }

  loadSchedules()
  {

    this.foodService.getFoodManagementList({user_id: this.userInfo.user_id, page: 1, per_page: 30}).subscribe( data => {
      if(data.result === true)
      {
        console.log('fmanage : ' + JSON.stringify(data.data.data));
        this.fmdatas = data.data.data;
      }
      else
      {
        if(data.flag === '3')
        {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        this.notification.showNotification('Failed' , data.message, 'error');
      }
    }, err => {
      console.log();
    });

  }

  getCategoryName(id: number) {
    for (let i = 0; i < cl_food_category.length; i++) {
      if (cl_food_category[i].id == id)
        return cl_food_category[i].value;
    }
  }

  getFoodStatusName(st)
  {
    for(let i=0; i<cl_foodstatus.length; i++)
      if(cl_foodstatus[i].id === st)
        return cl_foodstatus[i].value;
  }

  goToEditProfile()
  {
    this.router.navigate(['/profile-edit']);
  }

  checkUserType() {
    let userData = JSON.parse(localStorage.getItem('clientUser'));

    if (userData != null) {
      if (userData.user.type === 0)
        return true;
      else
        return false;
    }
    if (userData == null)
      return true;
  }

  checkToken() {
    let clientData = JSON.parse(localStorage.getItem('clientUser'));
    if (clientData) {
      if (clientData.token)
        return false;
    }
    return true;
  }

}
