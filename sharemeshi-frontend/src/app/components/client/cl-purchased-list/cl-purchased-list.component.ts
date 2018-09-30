import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { cl_configs } from '../../../config/cl-config';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClOrderService } from '../../../services/client/cl-order.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cl-purchased-list',
  templateUrl: './cl-purchased-list.component.html',
  styleUrls: ['./cl-purchased-list.component.css']
})
export class ClPurchasedListComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  modalRef: BsModalRef;

  reviewObj = {
    order_id: '',
    food_item_id: '',
    quality_ratings: 0,
    delivery_ratings: 0,
    communication_ratings: 0,
    review_description: ''
  };
  currentStep: any = 1;

  totalPage: any;
  paginatedDatas: any = [];
  serverUrl: any;

  finalObj: any = { per_page: 5, page: 1};

  paginateActive: any = 1;
  paginateWidgets: any = [];

  constructor(private router: Router,
              private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
              private notification: NotificationService,
              private modalService: BsModalService,
              private foodService: ClFoodService,
              private orderService: ClOrderService) {
               }

  ngOnInit() {

    this.foodService.setMenuItemActive('#nitem8');

    this.foodService.setHeaderCartNum();

    this.serverUrl = environment.base_url;

    this.doFilter();
  }

  openModal(template: TemplateRef<any>, orderid, fooditemid) {
    this.modalRef = this.modalService.show(template);
    this.reviewObj = { order_id: orderid,
                       food_item_id: fooditemid,
                       quality_ratings: 0,
                       delivery_ratings: 0,
                       communication_ratings: 0,
                       review_description: '' };
  }

  doSubmitReview() {
    if (this.reviewObj.review_description !== '') {
      if ((this.reviewObj.communication_ratings != 0 && this.reviewObj.delivery_ratings != 0 && this.reviewObj.quality_ratings != 0))
      {

        console.log(JSON.stringify(this.reviewObj));
        this.orderService.give3stepReview(this.reviewObj).subscribe(data => {
          if (data.result === false) {
            if (data.flag === '3') {
              localStorage.removeItem('clientUser');
              this.router.navigate(['/']);
            }
            this.notification.showNotification('Failed', data.message, 'error');
          }
          else {
            console.log("review result : " + JSON.stringify(data));
            this.modalRef.hide();
            this.notification.showNotification('Success', 'レビューを登録しました', 'success');
            this.doFilter();
          }
        }, err => {
          console.log('wow err');
        });
      }
      else {
        this.notification.showNotification('Error', 'レビューの星は1以上を登録してください', 'error');
      }
    }
    else {
      this.notification.showNotification('Error', 'レビューの本文を入力してください', 'error');
    }
  }

  clickedPaginate(val) {
    this.finalObj.page = val;
    this.paginateActive = val;

    this.doFilter();
  }

  clickedCaret(val) {
    switch (val) {
      case 0:
        this.finalObj.page = 1;
        break;
      case 1:
        if (this.finalObj.page > 1)
          this.finalObj.page = this.finalObj.page - 1;
        break;
      case 2:
        if (this.finalObj.page < this.totalPage)
          this.finalObj.page = this.finalObj.page + 1;
        break;
      case 3:
        this.finalObj.page = this.totalPage;
        break;
      default:
        break;
    }
    this.doFilter();
  }

  generatePaginateWidget(currentPage) {
    this.paginateActive = currentPage;
    this.paginateWidgets = [];

    if (currentPage === 1) {
      for (let i = 1; i <= this.totalPage; i++) {
        if (i < (currentPage + 3))
          this.paginateWidgets.push(i);
      }
    }
    else if (currentPage === this.totalPage) {
      for (let i = this.totalPage; i > 0; i--) {
        if ((currentPage - 3) < i)
          this.paginateWidgets.push(i);
      }
      this.paginateWidgets.reverse();
    }
    else {
      this.paginateWidgets.push(currentPage - 1);
      this.paginateWidgets.push(currentPage);
      this.paginateWidgets.push(currentPage + 1);
    }
  }

  doFilter() {
    console.log('FINAL : ' + JSON.stringify(this.finalObj));
    this.ng4LoadingSpinnerService.show();

      this.orderService.getPurchasedList(this.finalObj).subscribe(data => {
        console.log('poooreg : ' + JSON.stringify(data));
        this.ng4LoadingSpinnerService.hide();

        if (data.result === false) {
          if (data.flag === '3') {
            localStorage.removeItem('clientUser');
            this.router.navigate(['/']);
          }
          this.notification.showNotification('Failed', data.message, 'error');
        }
        else {
          if ((data.data.total % this.finalObj.per_page) > 0)
            this.totalPage = ((data.data.total - (data.data.total % this.finalObj.per_page)) / this.finalObj.per_page) + 1;
          else
            this.totalPage = data.data.total / this.finalObj.per_page;
          this.paginatedDatas = data.data.data;

          this.generatePaginateWidget(data.data.current_page);
          console.log("coco1 : " + data.data.total);
          console.log("coco2 : " + this.totalPage);
          console.log("paginatedDatas : " + JSON.stringify(this.paginatedDatas));
        }
      }, err => {
        console.log('error2');
      });

  }

  goToFoodList()
  {
    this.router.navigate(['/']);
  }

  reloadDatas() {
     this.doFilter();
  }

  goToFoodDetails(fid)
  {
    this.router.navigate(['/food-detail/' + fid]);
  }

  goToChat(cid, oid)
  {
    this.router.navigate(['/chatroom/' + cid + '/' + oid + '/purchased']);
  }

  getAdditionUnreadStyle(rstatus)
  {
    let aus = {
      'bottom': '75px'
    };
    if(rstatus === 0)
    {
      return aus;
    }
  }

  getOrderdate(odstr) {
    let odo = odstr.split(' ');
    return odo[0];
  }

  getCorrectDTime(mytime) {
    // console.log('mytime : ' + mytime);
    let PM = mytime.match('pm') ? true : false;

    let time = mytime.split(':');
    let min = time[1];

    let hour;
    if (PM) {
      hour = 12 + parseInt(time[0], 10);
      min = min.replace('pm', '');
    } else {
      hour = time[0];
      min = min.replace('am', '');
    }
    // console.log(hour + ':' + min);
    return hour + ':' + min;
  }

}
