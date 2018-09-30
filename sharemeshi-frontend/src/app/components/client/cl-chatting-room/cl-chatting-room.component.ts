import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClOrderService } from '../../../services/client/cl-order.service';
import { NotificationService } from '../../../services/notification.service';
import { cl_configs } from '../../../config/cl-config';
import { environment } from '../../../../environments/environment';

import { ClFoodService } from '../../../services/client/cl-food.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cl-chatting-room',
  templateUrl: './cl-chatting-room.component.html',
  styleUrls: ['./cl-chatting-room.component.css']
})
export class ClChattingRoomComponent implements OnInit, AfterViewChecked  {

  msgtexts: any = '';
  serverUrl: any = '';

  order_number: any;
  chat_history: any = [];
  chat_id: any = '';

  model: any = {page: 1, per_page: 10, chat_id: ''};

  chatmodel: any = {chat_id: ''};

  updatemodel: any = {chat_id: ''};

  viewflag = 0; // case for only scrolltop
  private currentTimeout: number;
  prev_pos: any = 0;
  real_pos: any = 0;

  comefrom: any = '';

  constructor(private activatedRouter: ActivatedRoute,
              private orderService: ClOrderService,
              private router: Router,
              private notification: NotificationService,
              private foodService: ClFoodService) { }

  ngOnInit() {

    this.foodService.setMenuItemActive('');

    this.serverUrl = environment.base_url;
    
    this.activatedRouter.params.subscribe(params => {
      if(params['chatid'] != undefined)
      {
        this.model.chat_id = params['chatid'];
        this.chatmodel.chat_id = params['chatid'];
        this.updatemodel.chat_id = params['chatid'];
        this.chat_id = params['chatid'];

        console.log('chatid : ' + this.model.chat_id);
        
        this.doUpdateMessages();
      }
      if(params['ordernumber'] != undefined)
      {
        this.order_number = params['ordernumber'];
      }
      if(params['comefrom'] != undefined)
      {
        this.comefrom = params['comefrom'];
      }
    });

    this.currentTimeout = setTimeout(() => {
      this.scrollToBottom();
    }, 800);

  }

  ngAfterViewChecked() {
    /*if(this.viewflag === 0)
    {
      console.log('after view checked');
      this.scrollToBottom();
      this.viewflag = 1;
    }*/
  } 

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    //this.viewflag = 1;
    if (this.chat_history.length !== 0) {
      if ($('.msgcontents').scrollTop() === 0)
      {
        // console.log('wowowowow : ' + $('.msgcontents')[0].scrollHeight);
        this.model.page += 1;
        this.getChathistory(2);
      }
    }
  }

  getAdditionStyle()
  {
    if(this.chat_history.length === 0)
    {
      let emptyStyle = {
        'text-align': 'center',
        'margin-top': '20px',
        'height': 'unset'
      };
      return emptyStyle;
    }
  }

  doUpdateMessages()
  {
    this.orderService.updateMessage(this.updatemodel).subscribe(data => {
      if(data.result === true)
      {
        this.orderService.setHeaderUnreadNum();
        this.getChathistory();
      }
      else {
        if (data.flag === '3') {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {

    });
  }

  getChathistory(flag = 1)
  {
    this.orderService.getChathistory(this.model).subscribe(data => {
      if (data.result === true) {
        
        if(data.data.data.length !== 0)
        {
          let tempdata = data.data.data;
          tempdata = tempdata.reverse();

          this.chat_history = tempdata.concat(this.chat_history);

          this.currentTimeout = setTimeout(() => {
            this.real_pos = $('.msgcontents')[0].scrollHeight - this.prev_pos;
            this.prev_pos += $('.msgcontents')[0].scrollHeight - this.prev_pos;
            // console.log("realpos : " + this.real_pos + "prev : " + this.prev_pos + ' whole : ' + $('.msgcontents')[0].scrollHeight);
            this.scrollToBottom(flag);
          }, 800);
        }
      }
      else {
        if (data.flag === '3') {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {
      console.log(err);
    });
  }

  scrollToBottom(flag = 1)
  {
    if(flag === 1) // go to the last bottom
    {
      // console.log('go last');
      $('.msgcontents').scrollTop($('.msgcontents')[0].scrollHeight);
    }
    else if(flag === 2) // go to the previous pos
    {
      // console.log('go prev');
      $('.msgcontents').scrollTop(this.real_pos);
    }
  }

  doSending()
  {
    //this.viewflag = 0;
    // console.log('gugu : ' + this.chatmodel.message);

    this.orderService.sendMessage(this.chatmodel).subscribe( data => {
      // console.log('sending : ' + JSON.stringify(data));

      if (data.result === true)
      {
        this.chatmodel.message = '';
        this.chat_history = [];
        this.model = { page: 1, per_page: 10, chat_id: this.chat_id };
        this.prev_pos = 0;
        this.real_pos = 0;
        this.getChathistory();

        this.currentTimeout = setTimeout(() => {
          this.scrollToBottom();
        }, 800);
      }
      else {
        if (data.flag === '3') {
          localStorage.removeItem('clientUser');
          this.router.navigate(['/']);
        }
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {
      console.log(err);
    });

  }

  returnToOrder()
  {
    if(this.comefrom === 'purchased')
    {
      this.router.navigate(['/purchased-list']);
    }
    if(this.comefrom === 'orderlist')
    {
      this.router.navigate(['/order-list/upcoming']);
    }
  }

  doRefresh()
  {
    //this.viewflag = 0;
    this.chat_history = [];
    this.model = { page: 1, per_page: 10, chat_id: this.chat_id };
    this.real_pos = 0;
    this.prev_pos = 0;
    this.doUpdateMessages();

    this.currentTimeout = setTimeout(() => {
      this.scrollToBottom();
    }, 800);
  }

}
