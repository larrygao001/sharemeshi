import { Component, OnInit } from '@angular/core';
import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { NotificationService } from '../../../services/notification.service';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-forgot-password',
  templateUrl: './cl-forgot-password.component.html',
  styleUrls: ['./cl-forgot-password.component.css']
})
export class ClForgotPasswordComponent implements OnInit {

  model: any = {};

  constructor(private authService: ClAuthenticationService,
              private notification: NotificationService,
              private foodService: ClFoodService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('');
  }

  doForgot() {
    this.authService.forgotPassword(this.model).subscribe(data => {
      if(data.result === true)
      {
        this.notification.showNotification('Success', "リセットメールを送信しました", 'success');
      }
      else
      {
        //for (let i = 0; i < data.errors.length; i++)
          console.log("ww : " + JSON.stringify(data));
          this.notification.showNotification('Failed', data.msg, 'error');
      }

    }, err => {
      console.log('error2');
    });
    console.log(JSON.stringify(this.model));
  }

}
