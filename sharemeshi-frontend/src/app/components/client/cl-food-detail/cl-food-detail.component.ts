import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { ClUserService } from '../../../services/client/cl-user.service';
import { NotificationService } from '../../../services/notification.service';
import { cl_food_category } from '../../../const/cl-food-category';
import { cl_configs } from '../../../config/cl-config';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import { cl_foodstatus } from '../../../const/cl-foodstatus';
import { environment } from '../../../../environments/environment';

declare var jQuery: any;
declare var $: any;
declare var PNotify: any;

@Component({
  selector: 'app-cl-food-detail',
  templateUrl: './cl-food-detail.component.html',
  styleUrls: ['./cl-food-detail.component.css']
})
export class ClFoodDetailComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  model: any = { category: 1000, country: 'none', keyword: '' };
  foodDatas: any = {user_avatar : []};
  category_name: any;
  serverUrl: any;

  cartData: any = { 'food_id': '', 'delivery_time': {} , 'quantity': 1};
  delivertime: any = '';

  page: any = 0;
  reviewDatas: any = [];
  current_rDatas: any = [];

  current_user_id: any;

  food_categories: any = [];
  quantity_array: any = [];

  constructor(private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private foodService: ClFoodService,
              private notification: NotificationService,
              private userService: ClUserService,
              private renderer: Renderer) { }

  ngOnInit() {
    this.renderer.setElementProperty(document.body, "scrollTop", 0);

    this.foodService.setMenuItemActive('');

    this.foodService.getFoodCategories().subscribe(data => {
      console.log('f category : ' + JSON.stringify(data));
      this.food_categories = data.data;

      this.serverUrl = environment.base_url;
      this.ng4LoadingSpinnerService.show();

      this.activateRoute.params.subscribe(params => {
        console.log('id' + params['id']);

        let id = params['id'];
        if (id) {
          this.foodService.getFoodDetail(id).subscribe(data => {

            console.log('fooddetails111 : ' + JSON.stringify(data));

            if (data.result === true) {
              this.foodDatas = data.data;
              this.foodDatas.price = parseInt(this.foodDatas.price);
              this.foodDatas.time_of_availability.sort();

              for (let j = 1; j <= this.foodDatas.quantity; j++)
              {
                this.quantity_array.push(j);
              }
              if(this.quantity_array.length != 0)
              {
                this.cartData.quantity = this.quantity_array[0];
              }

              // this.foodDatas.time_of_availability = JSON.parse(this.foodDatas.time_of_availability);

              this.category_name = this.foodDatas.category_name;
              console.log("images : " + JSON.stringify(data.data.food_images));

              this.current_user_id = data.data.offered_by;
              this.loadReviews();
            }
            else {
                this.notification.showNotification('Failed', data.message, 'error');
            }
          }, err => {
            console.log('error2');
          });

        }
        else {
          this.notification.showNotification('Error', 'No id founded', 'error');

        }
      });
    }, err => {
      console.log(err);
    });

  }

  loadReviews() {

    this.page += 1;
    console.log('num review : ' + this.current_user_id + ' / ' + this.page);
    this.userService.getReviews({ user_id: this.current_user_id, page: this.page, per_page: 5 }).subscribe(data => {
      console.log("reviews list : " + JSON.stringify(data));
      this.ng4LoadingSpinnerService.hide();

      if (data.result === true) {
        this.current_rDatas = data.data.data;
        for (let i = 0; i < data.data.data.length; i++)
          this.reviewDatas.push(data.data.data[i]);
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

  getFoodStatusName(st) {
    for (let i = 0; i < cl_foodstatus.length; i++)
      if (cl_foodstatus[i].id === st)
        return cl_foodstatus[i].value;
  }

  getRound(val)
  {
    return Math.round(val);
  }

  getCategoryName(id)
  {
    for(let i=0; i<cl_food_category.length; i++)
    {
      if(cl_food_category[i].id === id)
        return cl_food_category[i].value;
    }
  }

  setCategory(val, str) {
    this.model.category = val;
    this.model.category_name = str;
    $('#mycategory').text(str);
  }

  setCountry(val, str) {
    this.model.country = val;
    $('#mycountry').text(str);
  }

  doFilter() {
    if(this.model.keyword === '')
      this.model.keyword = 'none';
    this.router.navigate(['/food-list' + '/' + this.model.category + '/' + this.model.category_name + '/' + this.model.country + '/' + this.model.keyword]);
  }

  checkToken()
  {
    let clientData = JSON.parse(localStorage.getItem('clientUser'));
    if(clientData)
    {
      if(clientData.token)
        return false;
    }
    return true;
  }

  getDTime()
  {
    for (let i = 0; i < this.foodDatas.time_of_availability.length; i++)
    {
      if(i == this.delivertime)
        return this.foodDatas.time_of_availability[i];
    }

    return '';
  }

  goToLogin()
  {
    let tempCartData = {};

    if(this.delivertime !== '')
    {
      tempCartData['food_item_id'] = this.foodDatas.food_item_id;
      tempCartData['time'] = this.getDTime();
      tempCartData['quantity'] = this.cartData.quantity;

      localStorage.setItem('notloginedCartData', JSON.stringify(tempCartData));

      this.router.navigate(['/singin']);
    }
    else {
      this.notification.showNotification('Failed', 'お届け時間を選択してください', 'error');
    }
  }

  addToCart(val)
  {
    console.log('add ti car');

    this.cartData.food_item_id = this.foodDatas.food_item_id;
    let delivery_time = this.getDTime();
    this.cartData.time = delivery_time;

    let form_data = new FormData();
      for (let key in this.cartData) {
        if (key != 'food_id' && key != 'delivery_time')
          form_data.append(key, this.cartData[key]);
      }
    // console.log('kaka: ' + form_data.get('food_item_id'));

    if(this.delivertime !== '')
    {
      console.log('DATA : ' + JSON.stringify(this.cartData));
      this.foodService.addToCart(form_data).subscribe(data => {
        console.log('huhu : ' + JSON.stringify(data));
          if(data.result === true)
          {
            // this.notification.showNotification('Success' , 'Food added to the cart successfully' , 'success');
            this.router.navigate(['/cart-list']);
          }
          else if(data.result === false)
          {
            if(data.flag === '3')
            {
              localStorage.removeItem('clientUser');
              this.router.navigate(['/']);
            }
            this.notification.showNotification('Failed', data.message, 'error');
          }
      }, err => {
          console.log('err23');
      });
    }
    else
    {
      this.notification.showNotification('Error', 'お届け時間を選択して下さい', 'error');
    }
  }

  doBuy()
  {
    this.addToCart(2);
  }

}
