import { Component, OnInit } from '@angular/core';
import { ClAuthGuard } from '../../../guards/client/cl-auth.guard';
import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { query } from '@angular/core/src/animation/dsl';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { NotificationService } from '../../../services/notification.service';
import { cl_configs } from '../../../config/cl-config';

import { ClOrderService } from '../../../services/client/cl-order.service';
import { TitleService } from '../../../services/client/cl-title.service';

import { environment } from '../../../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cl-header',
  templateUrl: './cl-header.component.html',
  styleUrls: ['./cl-header.component.css']
})
export class ClHeaderComponent implements OnInit {

  nickname: any;
  cartnum: any = 0;

  myuserdata: any;
  base_url: any = environment.base_url;

  unread_datas = { purchased_num: 0, upcoming_num: 0 };

  lang: any = 'jp';

  timer: number;

  constructor(private foodService: ClFoodService,
              private notification: NotificationService,
              private authGuard: ClAuthGuard,
              private authService: ClAuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private orderService: ClOrderService,
              private mytitle: TitleService) {
                console.log('lang: ' + localStorage.getItem('language'));
                if (localStorage.getItem('language') == null)
                {
                  translate.use('jp');
                }
                else {
                translate.use(localStorage.getItem('language'));
                this.lang = localStorage.getItem('language');
                }

                foodService.cartNum.subscribe(num => this.changeCartNum(num));
                orderService.unreadDatas.subscribe(udatas => this.changeUnreadNums(udatas));
                foodService.chosenPageId.subscribe(iid => this.setActivate(iid));
              }

  ngOnInit() {
    this.foodService.setHeaderCartNum();

    console.log('this is header');
    this.orderService.setHeaderUnreadNum();

    /*$( "#nitem1" ).click(function() {
      $('.nitems').removeClass('clickedMenuItem');
      $(this).addClass('clickedMenuItem');
    });*/
  }

  setActivate(id)
  {
    if(id != '')
    {
      $('.nitems').removeClass('clickedMenuItem');
      $(id).addClass('clickedMenuItem');
    }
    else {
      $('.nitems').removeClass('clickedMenuItem');
    }
  }

  changeCartNum(num)
  {
    this.cartnum = num;
  }

  changeUnreadNums(udatas)
  {
    this.unread_datas = udatas;
    console.log('unread datas : ' + JSON.stringify(this.unread_datas));
  }

  switchLanguage(lang: string)
  {
    localStorage.setItem('language', lang);
    this.translate.use(localStorage.getItem('language'));
    this.timer = setTimeout(() => {
      this.mytitle.setTitle(0);
      
      let currentPageName = this.mytitle.getTitle(this.router.routerState, this.router.routerState.root).join('-');
      if(currentPageName == '#pcartlist')
      {
        this.foodService.sendLangChangedEvent();
      }
    }, 100);
    
  }

  checkUserType() {
    let userData = JSON.parse(localStorage.getItem('clientUser'));

    if(userData != null)
    {
      if ((userData.user.type === 0) || (userData.user.type === '0'))
      {
        return true;
      }
      else
        return false;
    }
  }

  checkAdmin() {
    let userData = JSON.parse(localStorage.getItem('clientUser'));

    if(userData != null)
    {
      if ((userData.user.type === 9) || (userData.user.type === '9'))
      {
        return true;
      }
      else
        return false;
    }
  }

  checkPostFood() {
    let userData = JSON.parse(localStorage.getItem('clientUser'));

    if (userData != null) {
      if ((userData.user.type === 0) || (userData.user.type === '0'))
        return true;
      else
        return false;
    }
    if (userData == null)
      return true;
  }

  checkLogined() {
    
    let userData = JSON.parse(localStorage.getItem('clientUser'));
    this.myuserdata = userData;

    if(userData != null)
    {
      // console.log('checklogined ... logined : ');
      this.nickname = userData.user.nick_name;
      return true;
    }  
    else
    {
      return false;
    }
    // return this.authGuard.canActivate();
  }

  doSignOut() {
    console.log("will signout");
    this.authService.logout();
    this.router.navigate(['/']);
  }

  doPostFood() {
    let clientData = JSON.parse(localStorage.getItem('clientUser'));
    if(clientData)
    {
      if(clientData.token)
      {
        this.router.navigate(['/food-post']);
      }
      else
      {
        console.log('ruru');
        this.router.navigate(['/singin']);
      }
    }
    else
    {
      console.log('ruru');
      this.router.navigate(['/singin']);
    }
    
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToCartList() {
    this.router.navigate(['/cart-list']);
  }

}
