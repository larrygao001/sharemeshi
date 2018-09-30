import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

@Injectable()
export class TitleService {
    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private translateService: TranslateService) { }

    setTitle(type, val = '') {
        let pptitle = this.getTitle(this.router.routerState, this.router.routerState.root).join('-');
        console.log('sss : ' + pptitle);

        if ((type != 1) && (pptitle != '#pprofile')) // normal
        {
            // let title = this.getTitle(this.router.routerState, this.router.routerState.root).join('-');
            this.titleService.setTitle(this.translateService.instant(pptitle) + ' | ' + this.translateService.instant('#planding'));
        }
        else { // profile page
            let mval = localStorage.getItem('pnickname');
            this.titleService.setTitle(mval + ' ' + this.translateService.instant('#profilesuffix') + ' | ' + this.translateService.instant('#planding'));
        }
    }

    getTitle(state, parent) {
        let data = [];
        if (parent && parent.snapshot.data && parent.snapshot.data.title) {
            data.push(parent.snapshot.data.title);
        }

        if (state && parent) {
            data.push(... this.getTitle(state, state.firstChild(parent)));
        }
        return data;
    }

}