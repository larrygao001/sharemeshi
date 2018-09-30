import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClFoodService } from '../../../services/client/cl-food.service';
import { NotificationService } from '../../../services/notification.service';
import { cl_configs } from '../../../config/cl-config';
import { cl_food_category } from '../../../const/cl-food-category';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';

declare var jQuery: any;
declare var $: any;
declare var PNotify: any;

@Component({
  selector: 'app-cl-food-management',
  templateUrl: './cl-food-management.component.html',
  styleUrls: ['./cl-food-management.component.css']
})
export class ClFoodManagementComponent implements OnInit {

  loadTemplate: string = cl_configs.loadgif;

  totalPage: any;
  paginatedDatas: any = [];
  serverUrl: any;

  finalObj: any = {};

  paginateActive: any = 1;
  paginateWidgets: any = [];

  modalRef: BsModalRef;
  chosedid: any;

  constructor(
    private ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private foodService: ClFoodService,
    private notification: NotificationService,
    private translateService: TranslateService,
    private modalService: BsModalService) { }

  ngOnInit() {

    this.foodService.setMenuItemActive('#nitem6');

    this.serverUrl = environment.base_url;

    this.finalObj['per_page'] = 5;
    this.finalObj['page'] = 1;

    this.doFilter();

  }

  goToAddFood() {
    this.router.navigate(['/food-post']);
  }

  openModal(template: TemplateRef<any>, fid)
  {
    this.chosedid = fid;
    this.modalRef = this.modalService.show(template);
  }

  getCategoryName(id: number) {
    for (let i = 0; i < cl_food_category.length; i++) {
      if (cl_food_category[i].id == id)
        return cl_food_category[i].value;
    }
  }

  setPageSize(val) {
    this.finalObj.per_page = val;
    this.finalObj.page = 1;

    $('#mypagesize').text(val);
    this.doFilter();
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

  doRodFilter() {
    this.finalObj.page = 1;
    this.doFilter();
  }

  doFilter() {
    let usersa = JSON.parse(localStorage.getItem('clientUser'));
    this.finalObj['user_id'] = usersa.user.user_id;

    console.log('FINAL : ' + JSON.stringify(this.finalObj));

    this.ng4LoadingSpinnerService.show();

    this.foodService.getFoodManagementList(this.finalObj).subscribe(data => {
      console.log('reg : ' + JSON.stringify(data));
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
      }
    }, err => {
      console.log('error2');
    });
  }

  checkRate(obj) {
    console.log("obj : " + obj);
  }

  doEditFood(fid) {

    this.router.navigate(['/food-edit/' + fid]);

  }

  doDeleteFood(fid) {

    let form_data = new FormData();
    form_data.append('food_item_id', fid);

    this.foodService.deleteFood(form_data).subscribe(data => {
      if(data.result === true) {
        this.notification.showNotification('Success', '削除しました', 'success');
        this.doFilter();
        this.modalRef.hide();
      }
      else {
        this.notification.showNotification('Failed', data.message, 'error');
      }
    }, err => {
      console.log('err');
    });

  }

  getOnlyDate(str)
  {
    let sdata = str.split(' ');
    return sdata[0];
  }

}
