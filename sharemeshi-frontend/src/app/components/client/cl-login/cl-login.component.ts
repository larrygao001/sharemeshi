import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { NotificationService } from '../../../services/notification.service';
import { ClFoodService } from '../../../services/client/cl-food.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cl-login',
  templateUrl: './cl-login.component.html',
  styleUrls: ['./cl-login.component.css']
})
export class ClLoginComponent implements OnInit {

  model: any = {};
  fdata: FormData;

  constructor(private router: Router,
              private authService: ClAuthenticationService,
              private notification: NotificationService,
              private foodService: ClFoodService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('#nitem10');
  }

  doLogin() {
    // console.log('login : ' + JSON.stringify(this.model));

    this.fdata = new FormData();
    for(let key in this.model){
      this.fdata.append(key, this.model[key]);
    }

    this.authService.login(this.fdata).subscribe(userAuthenticate => {
       console.log('aa : ' + JSON.stringify(userAuthenticate));
      if (userAuthenticate.result === true) // login info correct
      {
        userAuthenticate.profile.password = this.fdata.get('password');
        userAuthenticate.profile.password_confirmation = this.fdata.get('password');
        
          this.authService.setUserData(userAuthenticate).subscribe(userData => {
            let ud = JSON.parse(localStorage.getItem('clientUser'));
            console.log('111111storage data : ' + JSON.stringify(ud));

            this.foodService.setHeaderCartNum();

            this.notification.showNotification('Success', this.translateService.instant('#loginedSuccessMsg'), 'success');
            
            if (localStorage.getItem('notloginedCartData') != null)
            {
              this.router.navigate(['/cart-list']);
            }
            else {
              if(ud.user.type === 0) // creator
              {
                this.router.navigate(['/profile']);
              }
              else {
                this.router.navigate(['']);
              }
            }
            
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

}
