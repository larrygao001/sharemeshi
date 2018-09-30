import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { cl_configs } from '../../../config/cl-config';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClOrderService } from '../../../services/client/cl-order.service';
import { cl_genders } from '../../../const/cl-gender';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cl-order-list',
  templateUrl: './cl-order-list.component.html',
  styleUrls: ['./cl-order-list.component.css']
})
export class ClOrderListComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  modalRef: BsModalRef;
  clickedTab: any = 1;

  UpcomingreviewObj = { cart_id: 1, communication: 1, review: '' };

  PreviousreviewObj = {
    order_id: '',
    food_item_id: '',
    communication_ratings: 0,
    communication_description : ''
  };
  currentStep: any = 1;

  totalPage: any;
  UppaginatedDatas: any = [];
  PrepaginatedDatas: any = [];
  serverUrl: any;

  finalObj: any = {};

  paginateActive: any = 1;
  paginateWidgets: any = [];

  PaginateObjStore: any = [{per_page: 5, page: 1},
                           { per_page: 5, page: 1}];

  eaterBriefInfo: any = {};
  rpReviewObj: any = {};

  constructor(private router: Router,
              private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
              private notification: NotificationService,
              private modalService: BsModalService,
              private foodService: ClFoodService,
              private orderService: ClOrderService,
              private activatedRouter: ActivatedRoute) { }

  ngOnInit() {

    this.foodService.setMenuItemActive('#nitem7');

    this.activatedRouter.params.subscribe(params => {
      if(params['ordertype'] != undefined)
      {
        if(params['ordertype'] == 'upcoming')
          this.clickedTab = 1;
        else if(params['ordertype'] == 'previous')
          this.clickedTab = 2;

        this.foodService.setHeaderCartNum();

        this.serverUrl = environment.base_url;
        this.finalObj = this.PaginateObjStore[this.clickedTab - 1];
        this.doFilter();
      }
    });

  }

  clickedTabEvent(val)
  {
    if( val === 1 )
    {
      this.router.navigate(['/order-list/upcoming']);
    }
    else if (val === 2) {
      this.router.navigate(['/order-list/previous']);
    }
    /*this.clickedTab = val;

    console.log('clickedTab~f : ' + this.clickedTab);

    if(val === 1 )
    {
      this.PaginateObjStore[1] = this.finalObj;
      this.finalObj = this.PaginateObjStore[0];
    }
    else if(val === 2)
    {
      this.PaginateObjStore[0] = this.finalObj;
      this.finalObj = this.PaginateObjStore[1];
    }

    this.doFilter();*/
  }

  openModal(template: TemplateRef<any>, flag, orderid, fooditemid) {

    if(flag === 2)
    {
      this.PreviousreviewObj = {
        order_id: orderid,
        food_item_id: fooditemid,
        communication_ratings: 0,
        communication_description : ''
      };
      this.currentStep = 1;
    }
    this.modalRef = this.modalService.show(template);
  }

  nextReviewStep() {
    this.currentStep += 1;
  }

  prevReviewStep() {
    this.currentStep -= 1;
  }

  doSubmitReview(flag)
  {
    /*if(flag === 1) //up
    {
      if(this.UpcomingreviewObj.review !== '')
      {
          console.log(JSON.stringify(this.UpcomingreviewObj));
          this.orderService.give1stepReview(this.UpcomingreviewObj).subscribe( data => {
            if (data.result === false) {
              if (data.status === 700) {
                localStorage.removeItem('clientUser');
                this.router.navigate(['/']);
              }
              for (let i = 0; i < data.errors.length; i++)
                this.notification.showNotification('Error', data.errors[i].message, 'error');
            }
            else {
              console.log("review result : " + JSON.stringify(data));
              this.modalRef.hide();
              this.notification.showNotification('Success', 'give review successfully', 'success');
              this.doFilter();
            }
          }, err => {
              console.log('wow err');
          });
      }
      else
      {
        this.notification.showNotification('Error', 'Please give any review', 'error');
      }
    }*/
    if(flag === 2)
    {
      if (this.PreviousreviewObj.communication_description  !== '')
      {
        if(this.PreviousreviewObj.communication_ratings != 0)
        {
          console.log(JSON.stringify(this.PreviousreviewObj));
          this.orderService.give1stepReview(this.PreviousreviewObj).subscribe(data => {
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
      else
      {
        this.notification.showNotification('Error', 'レビュー本文を入力してください', 'error');
      }
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
    if(this.clickedTab === 1)
    {
        this.orderService.getUpcomingOrders(this.finalObj).subscribe(data => {
          console.log('orderdata : ' + JSON.stringify(data));
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

            this.UppaginatedDatas = data.data.data;

            this.generatePaginateWidget(data.data.current_page);
            console.log("coco1 : " + data.data.total);
            console.log("coco2 : " + this.totalPage);
          }
        }, err => {
          console.log('error2');
        });
    }
    else
    {
      this.orderService.getPreviousOrders(this.finalObj).subscribe(data => {
        console.log('Prevreg : ' + JSON.stringify(data));
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
          this.PrepaginatedDatas = data.data.data;
          console.log('prepageinageted : ' + this.PrepaginatedDatas.length);

          this.generatePaginateWidget(data.data.current_page);
          console.log("coco1 : " + data.data.total);
          console.log("coco2 : " + this.totalPage);
        }
      }, err => {
        console.log('error2');
      });
    }

  }

  goToFoodList()
  {
    this.router.navigate(['/food-list']);
  }

  reloadDatas()
  {
    this.doFilter();
    // this.ngOnInit();
  }

  goToFoodDetails(fid)
  {
    this.router.navigate(['/food-detail/' + fid]);
  }

  goToChat(cid, oid)
  {
    this.router.navigate(['/chatroom/' + cid + '/' + oid + '/orderlist']);
  }

  openEaterInfo(template: TemplateRef<any>, info)
  {
    this.eaterBriefInfo = info;
    this.modalRef = this.modalService.show(template);
  }

  openReviewPreview(template: TemplateRef<any>, reviewObj)
  {
    this.rpReviewObj = reviewObj;
    this.modalRef = this.modalService.show(template);
  }

  getOrderDate(odstr)
  {
    let odo = odstr.split(' ');
    return odo[0];
  }

  getGenderStr(id)
  {
    for (let i=0; i<cl_genders.length; i++)
    {
      if(cl_genders[i].id === parseInt(id))
        return cl_genders[i].value;
    }
  }

}
