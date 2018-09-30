import { Component, OnInit } from '@angular/core';
import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-reset-password',
  templateUrl: './cl-reset-password.component.html',
  styleUrls: ['./cl-reset-password.component.css']
})
export class ClResetPasswordComponent implements OnInit {

  model: any = {};

  constructor(private authService: ClAuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private foodService: ClFoodService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('');
  }

  doResetPassword()
  {
    if (this.model.password === this.model.confirm_password)
    {
      if(this.model.password.length >= 6)
      {
        this.activatedRoute.params.subscribe(params => {
            console.log('code' + params['code']);
            this.model.email = params['email'];
            this.model.token = params['code'];
            if (this.model.email && this.model.token)
            {
              this.authService.resetPassword(this.model).subscribe(data => {
                if(data.result === true)
                {
                  this.notification.showNotification('Success', 'パスワードを変更しました', 'success');
                  this.router.navigate(['/singin']);
                }
                else
                {
                  this.notification.showNotification('Failed', data.message, 'error');
                }
              }, err => {
                console.log('error2');
              });
            }
            else
            {
              this.notification.showNotification('Error', '再度、メール認証を行ってください', 'error');
            }
          });
      }
      else
      {
        this.notification.showNotification('Error', 'パスワードは6文字以上で設定してください', 'error');
      }
    }
    else{
      this.notification.showNotification('Error' , 'パスワードが一致しません' , 'error');
    }
  }

}
