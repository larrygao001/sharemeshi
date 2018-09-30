import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
/*import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { TitleService } from '../../../services/client/cl-title.service';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

declare var jquery: any;
declare var $: any; */

@Component({
  selector: 'app-cl-container',
  templateUrl: './cl-container.component.html',
  styleUrls: ['./cl-container.component.css']
})
export class ClContainerComponent implements OnInit {

  constructor(private router: Router,
    /*private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
  private mytitle: TitleService*/) { }

  timer: number;

  ngOnInit() {
    /*this.defaultTitle();

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
        this.mytitle.setTitle(0);
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        $('html,body').animate({ scrollTop: $('.tophere').offset().top - 100 }, '1');
    });*/
  }

  /*defaultTitle() {
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

  }*/

}
