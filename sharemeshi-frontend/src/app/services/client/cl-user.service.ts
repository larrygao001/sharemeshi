import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.interceptor';
import 'rxjs/add/operator/map';

import { ClAuthenticationService } from './cl-authentication.service';
import { ClUser } from '../../models/client/index';
import { cl_configs } from '../../config/cl-config';
import { environment } from '../../../environments/environment';

@Injectable()
export class ClUserService {
    constructor(
        private http: Http,
        private httpService: HttpService,
        private authenticationService: ClAuthenticationService) {
    }

    getUser(uid: any): Observable<any> {
        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });

        let mformdata = new FormData();
        mformdata.append('user_id' , uid);

        return this.httpService.post(environment.base_url + '/api/user/details', mformdata, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getUserSession(): Observable<any> {
        let clienData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clienData.token });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.get(environment.base_url + '/api/user/info', options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getReviews(model: any): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ });
        let options = new RequestOptions({ headers: headers });


        return this.httpService.post(environment.base_url + '/api/review/user', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    postContactInfo(model: any): Observable<any> {

        let headers = new Headers({ });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/send-feedback', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getNewsList(model: any): Observable<any> {
        
        let headers = new Headers({ });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/news-list', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });

    }

    getNewsDetail(model: any): Observable<any> {
        
        let headers = new Headers({ });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/news-details', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });

    }

}
