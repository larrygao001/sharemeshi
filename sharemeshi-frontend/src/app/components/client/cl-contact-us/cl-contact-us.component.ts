import { Component, OnInit } from '@angular/core';
import { ClUserService } from '../../../services/client/cl-user.service';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';
import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-contact-us',
  templateUrl: './cl-contact-us.component.html',
  styleUrls: ['./cl-contact-us.component.css']
})
export class ClContactUsComponent implements OnInit {

  tmodel: any = {};

  constructor(private userService: ClUserService,
              private notificationService: NotificationService,
              private router: Router,
              private foodService: ClFoodService) { }

  ngOnInit() {
    this.foodService.setMenuItemActive('');
  }

  doContact() {
    console.log('cdata : ' + JSON.stringify(this.tmodel));
    this.userService.postContactInfo(this.tmodel).subscribe( data => {
        if(data.result === true)
        {
          this.notificationService.showNotification('Success', 'お問い合わせを送信しました', 'success');
          this.router.navigate(['/']);
        }
        else
        {
          this.notificationService.showNotification('Failed', data.message, 'error');
        }
    }, err => {
      console.log('err');
    });
  }

}
