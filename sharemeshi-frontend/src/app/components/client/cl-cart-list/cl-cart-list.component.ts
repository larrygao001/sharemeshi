import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { NotificationService } from '../../../services/notification.service';
import { cl_food_category } from '../../../const/cl-food-category';
import { cl_configs } from '../../../config/cl-config';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import { ClPaymentService } from '../../../services/client/cl-payment.service';
import { ClOrderService } from '../../../services/client/cl-order.service';
import { environment } from '../../../../environments/environment';

import { TranslateService } from '@ngx-translate/core';

declare var paypal: any;

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cl-cart-list',
  templateUrl: './cl-cart-list.component.html',
  styleUrls: ['./cl-cart-list.component.css']
})
export class ClCartListComponent implements OnInit, AfterViewChecked {

  private didRenderPaypal: boolean = false;

  loadTemplate: string = cl_configs.loadgif;

  cartDatas: any = [];

  serverUrl: any;
  cartChanges: any = [];

  ppclient: any = {};

  private currentTimeout: number;

  constructor(private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
              private foodService: ClFoodService,
              private notification: NotificationService,
              private router: Router,
              private paymentService: ClPaymentService,
              private orderService: ClOrderService,
              private translateService: TranslateService) {
                foodService.langChanged.subscribe(cdata => this.doUpdateCart(3));
               }

  ngOnInit() {

    this.foodService.setMenuItemActive('#nitem12');
    
    if (localStorage.getItem('notloginedCartData') != null)
    {
      let nlcd = JSON.parse(localStorage.getItem('notloginedCartData'));
      let form_data = new FormData();
      for (let key in nlcd) {
        if (key != 'food_id' && key != 'delivery_time')
          form_data.append(key, nlcd[key]);
      }

      localStorage.removeItem('notloginedCartData');

      this.foodService.addToCart(form_data).subscribe(data => {
        console.log('huhu : ' + JSON.stringify(data));
          if(data.result === true)
          {
            // this.notification.showNotification('Success' , 'Food added to the cart successfully' , 'success');
            this.initCartPage();
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
    else {
      this.initCartPage();
    }
  }

  initCartPage() {
    this.serverUrl = environment.base_url;
    $('<div>', {
      'class': 'paypal-mybutton',
      'id': 'paypal-button-container1',
      css: {
        /*'background-color': 'red',
        'height': '10px'*/
      }
    }).appendTo('.purchaseBtns');
    this.loadCartDatas();
  }

  loadCartDatas()
  {
    this.ng4LoadingSpinnerService.show();
    this.foodService.getCart().subscribe(data => {
      // console.log('huhu : ' + JSON.stringify(data));
      this.ng4LoadingSpinnerService.hide();

      if (data.result === true) {
        // this.notification.showNotification('Success', 'Load the cart list successfully', 'success');
        this.cartDatas = data.data;
        
        console.log('loog : ' + JSON.stringify(this.cartDatas));
        
        this.cartChanges = [];
        let checkNull = 0; //init
        for (let i = 0; i < this.cartDatas.length; i++)
        {
          // this.cartDatas[i].price = parseInt(this.cartDatas[i].price);
          // this.cartDatas[i].total_price = this.cartDatas[i].quantity * (this.cartDatas[i].price + this.getRound(this.cartDatas[i].price / 20));
          this.cartChanges.push({ changer: 0 });

          if(this.cartDatas[i].quantity != 0)
          {
            checkNull = 1; //not null
          }

          this.cartDatas[i]['quantity_arr'] = [];
          for (let j = 1; j <= this.cartDatas[i].food_details.quantity; j++) {
            this.cartDatas[i]['quantity_arr'].push(j);
          }

        }

        if(checkNull === 0)
        {
          this.cartDatas = [];
        }
        if(this.cartDatas.length != 0)
        {
          console.log('cartdatas not null : ' + JSON.stringify(this.cartDatas));
          this.goToPaypal();
        }
      }
      else if(data.result === false) {
        if (data.flag === '3') {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {
      console.log('err23');
    });
  }

  ngAfterViewChecked() {
  }

  getRound(val) {
    return val.toFixed(2);
  }

  doPlus(ind)
  {
    this.cartChanges[ind].changer += 1;

    this.cartDatas[ind].quantity += 1;
    this.cartDatas[ind].commission = Math.round(((this.cartDatas[ind].quantity * this.cartDatas[ind].price) / 20) * 100) / 100;
    this.cartDatas[ind].total_price = this.cartDatas[ind].commission + (this.cartDatas[ind].quantity * this.cartDatas[ind].price);
    
    this.doUpdateCart(3);
  }

  doMinus(ind)
  {
    this.cartChanges[ind].changer -= 1;

    this.cartDatas[ind].quantity -= 1;
    this.cartDatas[ind].commission = Math.round(((this.cartDatas[ind].quantity * this.cartDatas[ind].price) / 20) * 100) / 100;
    this.cartDatas[ind].total_price = this.cartDatas[ind].commission + (this.cartDatas[ind].quantity * this.cartDatas[ind].price);

    this.doUpdateCart(3);
    // if(this.cartDatas[ind].quantity === 0)
    //  this.cartChanges[ind].amountflag = 0;

  }

  onChangeQuantity(ev, ind)
  {  
    console.log('changed quantity : ' + ev + ' index : ' + ind);

    this.cartChanges[ind].changer = 1;

    this.cartDatas[ind].quantity = ev;
    this.cartDatas[ind].commission = Math.round(((this.cartDatas[ind].quantity * this.cartDatas[ind].price) / 20) * 100) / 100;
    this.cartDatas[ind].total_price = this.cartDatas[ind].commission + (this.cartDatas[ind].quantity * this.cartDatas[ind].price);

    this.doUpdateCart(3);
    
  }

  checkChanges()
  {
    for(let i = 0; i < this.cartChanges.length; i++)
    {
        if(this.cartChanges[i].changer !== 0)
          return false;
    }
    return true;
  }

  postPayments(pdata) {
    this.ng4LoadingSpinnerService.show();

    this.paymentService.postPaymentData(pdata).subscribe(mdata => {
      console.log('mmdata : ' + JSON.stringify(mdata));
      this.ng4LoadingSpinnerService.hide();

      if (mdata.result === true) {
        this.notification.showNotification('Success', 'お支払いが完了しました', 'success');
        // this.loadCartDatas();

        let clientData = JSON.parse(localStorage.getItem('clientUser'));
        // console.log('kaka : ' + clientData.user.usertype);
        this.router.navigate(['/purchased-list']);
      }
      else {
        if (mdata.flag === '3') {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        for(let key in mdata.errors)
        this.notification.showNotification('Failed', mdata.message, 'error');
      }
    }, err => {

    });
  }

  configurePaypal() {
    console.log('pp id : ' + cl_configs.payal_clientId);
    let handler = this;

    let totalSum = 0;
    for(let i = 0; i < this.cartDatas.length; i++)
      totalSum += parseInt(this.cartDatas[i].price);

    // totalSum += totalSum / 10;
    // totalSum = (Math.round(totalSum * 100) / 100); // USD
    totalSum = Math.round(totalSum);
    

    console.log("totalsum : " + totalSum);

    if (environment.PAYPAL_MODE == 'sandbox')
    {
      this.ppclient = {
        sandbox: environment.PAYPAL_CLIENT_KEY
      };
    }
    if (environment.PAYPAL_MODE == 'production')
    {
      this.ppclient = {
        production: environment.PAYPAL_CLIENT_KEY
      };
    }

    console.log('pp mode : ' + environment.PAYPAL_MODE);
    console.log('pp client : ' + JSON.stringify(this.ppclient));
    
    // if (!this.didRenderPaypal) {
      // var userId = 2;
      // this.loadPaypalScript().then(() => {

        this.ng4LoadingSpinnerService.hide();

        paypal.Button.render({
          env: environment.PAYPAL_MODE, // sandbox | production
          // Create a PayPal app: https://developer.paypal.com/developer/applications/create
          client: this.ppclient,
          // Show the buyer a 'Pay Now' button in the checkout flow
          locale: this.translateService.instant('#Paypal_lang'),
          commit: true,
          // payment() is called when the button is clicked
          payment: function (data, actions) {
            // Make a call to the REST api to create the payment
            return actions.payment.create({
              payment: {
                transactions: [
                  {
                    amount: {
                      total: totalSum,
                      currency: 'JPY'
                    }
                  }
                ]
              }
            });
          },
          // onAuthorize() is called when the buyer approves the payment
          onAuthorize: function (data, actions) {
            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then(function () {

              console.log(data);
              let smodel = new FormData();
              smodel.append('paymentID', data.paymentID);
              handler.postPayments(smodel);
              
            });
          }
        }, '.paypal-mybutton');
      // });
    // }
  }
  private loadPaypalScript(): Promise<any> {
    this.didRenderPaypal = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  goToPaypal()
  {
    this.configurePaypal();
  }

  IsorderWithEmptyFood()
  {
    for(let i = 0; i < this.cartDatas.length; i++)
    {
      if(this.cartDatas[i].quantity !== 0)
        return false;
    }
    return true;
  }

  checkAvailabilty()
  {
    let caflag = 0;
    this.orderService.checkOrderAvailability({}).subscribe(data => {
      console.log('availiabiyt:  ' + JSON.stringify(data));
      console.log(data.result);
      for(let i = 0; i < data.length; i++)
      {
        if (data[i].result === true) {
          
        }
        else {
          caflag = 1;
          this.notification.showNotification(data[i].message.foodname, data[i].message.error, 'error');
        }
      }
      if(caflag == 0) //success
        this.goToPaypal();
      
    }, err => {
      console.log('err');
    });
  }

  doOrderPlace()
  {
    if(this.checkChanges() === false)
    {
        if(!this.IsorderWithEmptyFood())
        {
          this.doUpdateCart(2);
        }
        else
        {
          // this.notification.showNotification('Error', 'There is no food', 'error');
        }
    }
    else
    {
      this.checkAvailabilty();
      // this.router.navigate(['/order-list']);
    }
  }

  doUpdateCart(type)
  {
    $('#paypal-button-container1').remove();
    this.currentTimeout = setTimeout(() => {
      if ($('#paypal-button-container1').length === 0) {
        console.log('empty%%%%%');
        $('<div>', {
          'class': 'paypal-mybutton',
          'id': 'paypal-button-container1',
          css: {
            /*'background-color': 'red',
            'height': '10px'*/
          }
        }).appendTo('.purchaseBtns');

        this.ng4LoadingSpinnerService.show();

        let finalObj = [];
        let form_data = new FormData();
        let mflag = 1; // check all success

        for (let i = 0; i < this.cartChanges.length; i++) {
          if (this.cartChanges[i].changer !== 0) {
            finalObj.push({ 'cart_id': this.cartDatas[i].cart_id, 'quantity': this.cartDatas[i].quantity });
          }
        }
        form_data.append('changed', JSON.stringify(finalObj));

        this.foodService.updateCart(form_data).subscribe(data => {
          console.log('reauiii : ' + JSON.stringify(data));
          for (let i = 0; i < data.length; i++) {
            if (data[i].result === true) {
              this.notification.showNotification(data[i].message.foodname, data[i].message.success, 'success');
            }
            else {
              mflag = 2; //error occured

              if (data[i].flag === '3') {
                localStorage.removeItem('clientUser');
                this.router.navigate(['/']);
                this.notification.showNotification('Failed', data[i].message, 'error');
              }
              else {
                this.notification.showNotification(data[i].message.foodname, data[i].message.error, 'error');
              }
            }
          }
          this.loadCartDatas();
          this.foodService.setHeaderCartNum();

        }, err => {
          console.log('err2');
        });
      }
    }, 1000);
  }

  goToFoodList()
  {
    this.router.navigate(['/']);
  }

}
