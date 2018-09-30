import { Component, OnInit, enableProdMode } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { TitleService } from './services/client/cl-title.service';

import { environment } from '../environments/environment';

import { ClFoodService } from '../app/services/client/cl-food.service';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  timer: number;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private mytitle: TitleService,
    private foodService: ClFoodService) { }

  ngOnInit() {
    console.log('ak~~~~~~~');
    /*if (environment.production) {
      enableProdMode();
      
      console.log = function() {}
      /*if(window){
        window.console.log=function(){};
      }
    }*/

    this.foodService.setHeaderCartNum();
    this.defaultTitle();

    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((evt) => {
        
        this.foodService.setHeaderCartNum();
        this.mytitle.setTitle(0);
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        /*$('html,body').animate({ scrollTop: $('.tophere').offset().top - 100 }, '1');*/
    });
    
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scroll(0, 0);
    });
  }

  defaultTitle() {
    this.timer = setTimeout(() => {
      console.log('default tranlste');
      let lang = localStorage.getItem('language');
      if (lang == null) {
        this.translateService.use('jp');
        lang = 'jp';
      }
      else {
        this.translateService.use(lang);
      }
      this.mytitle.setTitle(0);
    }, 100);

  }

}
