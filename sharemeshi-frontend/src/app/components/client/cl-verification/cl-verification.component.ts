import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClAuthenticationService } from '../../../services/client/cl-authentication.service';
import { NotificationService } from '../../../services/notification.service';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-verification',
  templateUrl: './cl-verification.component.html',
  styleUrls: ['./cl-verification.component.css']
})
export class ClVerificationComponent implements OnInit {

  verify_status = '#EmailVerification';

  constructor(private activateRoute: ActivatedRoute,
    private authService: ClAuthenticationService,
    private router: Router,
    private notification: NotificationService,
    private foodService: ClFoodService) { }

  ngOnInit() {

    this.foodService.setMenuItemActive('');

    this.activateRoute.params.subscribe(params => {
      console.log('code' + params['code']);
      let code = params['code'];
      if(code)
      {
        this.authService.verification(code).subscribe(data => {
            console.log('veri : ' + JSON.stringify(data));
            if(data.result === true)
            {
              this.verify_status = '#SuccessfullyVerified';
              this.router.navigate(['/register-complete/' + data.data.user_id]);
            }
            else{
                this.notification.showNotification('Failed', data.message, 'error');
            }
        }, err => {
          console.log('error2');
        });

      }
      else
      {
        this.notification.showNotification('Error', '送信された認証メールをご確認下さい', 'error');
      }
    });
  }

}
