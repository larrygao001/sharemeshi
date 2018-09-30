import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { NotificationService } from '../../../services/notification.service';
import { cl_configs } from '../../../config/cl-config';
import { cl_food_category } from '../../../const/cl-food-category';
import { ClUserService } from '../../../services/client/cl-user.service';

import { environment } from '../../../../environments/environment';

declare var jQuery: any;
declare var $: any;
declare var PNotify: any;

@Component({
  selector: 'app-cl-landing',
  templateUrl: './cl-landing.component.html',
  styleUrls: ['./cl-landing.component.css']
})
export class ClLandingComponent implements OnInit {

  url = 'assets/frontend/images/';

  model: any = { category: 1000, country: 'none', keyword: '' };

  pages: any = { page: 1, per_page: 5 };

  serverUrl: any = environment.base_url;

  availableDatas: any = [];
  closedDatas: any = [];

  newsNum: any = 5;
  newsArray: any = [];
  newsmoreflag: any = 0; // show

  myuserdata: any;

  constructor(private router: Router,
              private foodService: ClFoodService,
              private notification: NotificationService,
              private userService: ClUserService){
                  }

  ngOnInit() {

    // this.loadMap(); no need load map

     this.loadAvailableFoods();
     this.loadClosedFoods();
     this.loadNews();

     this.foodService.setMenuItemActive('#nitem1');

  }

  loadNews() {
    this.userService.getNewsList({ news_number : this.newsNum.toString()}).subscribe( data => {
      console.log('news data : ' + JSON.stringify(data) + ' newsnum :' + this.newsNum);
      if(this.newsArray.length == data.data.length)
      {
        this.newsmoreflag = 1; // hide
      }
      this.newsArray = data.data;
      this.newsNum += 5;
    }, err => {
      console.log(err);
    })
  }

  getCategoryName(id: number) {
    for (let i = 0; i < cl_food_category.length; i++) {
      if (cl_food_category[i].id == id)
        return cl_food_category[i].value;
    }
  }

  checkLogined() {
    let userData = JSON.parse(localStorage.getItem('clientUser'));
    this.myuserdata = userData;

    // console.log('dddd : ' + this.myuserdata.result);

    if(this.myuserdata == null) {
      return true;
    }
    else {
      return false;
    }
  }

  loadAvailableFoods()
  {

    this.foodService.getFoodList({ page: 1, per_page: 8, ftype: 2 }).subscribe( data => {
       if(data.result === true)
       {
          this.availableDatas = data.data.data;
          console.log("tm111 : " + JSON.stringify(this.availableDatas));
       }  
       else
       {
         
        this.notification.showNotification('Failed', data.message, 'error');
       }
    }, err => {
        console.log("err");
    });

  }
  
  loadClosedFoods() {
    this.foodService.getFoodList({ page: 1, per_page: 12, ftype: 3}).subscribe(data => {
      if (data.result === true) {
        //console.log("closed tm : " + JSON.stringify(data.data));
        this.closedDatas = data.data.data;
      }
      else {
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {
      console.log("err");
    });
  }

  goToMoreFoods(val)
  {
    if(val === 0) //available
    {
      this.router.navigate(['/food-list/2']);
    }
    if(val === 1) //closed
    {
      this.router.navigate(['/food-list/3']);
    }
    
  }

  goToFoodDetails(url)
  {
    this.router.navigate([url]);
  }

  setCategory(val, str) {
    this.model.category = val;
    $('#mycategory').text(str);
  }

  setCountry(val, str) {
    this.model.country = val;
    $('#mycountry').text(str);
  }

  doFilter() {
    if (this.model.keyword === '')
      this.model.keyword = 'none';
    this.router.navigate(['/food-list' + '/' + this.model.category + '/' + this.model.country + '/' + this.model.keyword]);
  }

  loadMap()
  {
    jQuery('#road_map.directory-map').goMap({
      maptype: 'ROADMAP',
      latitude: 51.450711,
      longitude: 0.2760004,
      zoom: 12,
      scaleControl: true,
      scrollwheel: false,
      //        group: 'category',
      markers: [
        //            Markers for Doctor Search
        {
          latitude: 51.511622, longitude: -0.150375, icon: '' + this.url + 'map/5.png', html: {
            content: ''
          }
        },
        {
          latitude: 51.524440, longitude: -0.241699, icon: '' + this.url + 'map/3.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.537388, longitude: -0.077033, icon: '' + this.url + 'map/6.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.508930, longitude: -0.347543, icon: '' + this.url + 'map/2.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.508550, longitude: -0.008712, icon: '' + this.url + 'map/8.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.549831, longitude: -0.304971, icon: '' + this.url + 'map/1.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.486562, longitude: -0.310364, icon: '' + this.url + 'map/4.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.482473, longitude: -0.094542, icon: '' + this.url + 'map/7.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
      ]
    });


    /* Calling goMap() function, initializing map and adding markers. */
    jQuery('#road_map').goMap({
      maptype: 'ROADMAP',
      latitude: 51.450711,
      longitude: 0.2760004,
      zoom: 13,
      scaleControl: true,
      scrollwheel: false,
      //        group: 'category',
      markers: [
        //            Markers for Doctor Search
        {
          latitude: 51.5131094, longitude: -0.176425, icon: '' + this.url + '/mapicon/1.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.511218, longitude: -0.147124, icon: '' + this.url + '/mapicon/2.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.515918, longitude: -0.219050, icon: '' + this.url + '/mapicon/3.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.4941563, longitude: -0.1710176, icon: '' + this.url + '/mapicon/4.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.5238585, longitude: -0.0950225, icon: '' + this.url + '/mapicon/5.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.4965787, longitude: -0.1169972, icon: '' + this.url + '/mapicon/6.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.5096738, longitude: -0.2753873, icon: '' + this.url + '/mapicon/6.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.4965787, longitude: -0.199223, icon: '' + this.url + '/mapicon/7.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.4925041, longitude: -0.2363018, icon: '' + this.url + '/mapicon/8.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.5202758, longitude: -0.118047, icon: '' + this.url + '/mapicon/1.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.5249492, longitude: -0.2450565, icon: '' + this.url + '/mapicon/1.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.532054, longitude: -0.1639875, icon: '' + this.url + '/mapicon/8.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },
        {
          latitude: 51.5082309, longitude: -0.076872, icon: '' + this.url + '/mapicon/3.png', html: {
            content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
          }
        },

      ]
    });


  }

}
