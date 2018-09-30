import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClUserService } from '../../../services/client/cl-user.service';
import { cl_configs } from '../../../config/cl-config';

import { environment } from '../../../../environments/environment';

import { ClFoodService } from '../../../services/client/cl-food.service';

@Component({
  selector: 'app-cl-news-detail',
  templateUrl: './cl-news-detail.component.html',
  styleUrls: ['./cl-news-detail.component.css']
})
export class ClNewsDetailComponent implements OnInit {

  newsData: any = {};

  constructor(private activatedRoute: ActivatedRoute,
              private userService: ClUserService,
              private foodService: ClFoodService) { }

  ngOnInit() {

    this.foodService.setMenuItemActive('');

    this.activatedRoute.params.subscribe(param => {
      if(param['newsid'] != undefined)
      {
        console.log('news id : ' + param['newsid']);
        this.userService.getNewsDetail({ news_id : param['newsid'].toString() }).subscribe( data => {
           console.log('json : ' + JSON.stringify(data));
           this.newsData = data.data;
           
           let contents = this.newsData.contents;
           let pos = contents.indexOf('"/');
           if(pos != -1)
           {
             contents = [contents.slice(0, pos + 1), environment.base_url, contents.slice(pos + 1)].join('');
             this.newsData.contents = contents;
           }
           
        }, err => {
          console.log(err);
        });
      }
    });

  }

}
