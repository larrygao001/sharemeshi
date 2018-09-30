import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.interceptor';
import { JwtHelper } from 'angular2-jwt/angular2-jwt';
import 'rxjs/add/operator/map';
import { cl_configs } from '../../config/cl-config';
import { environment } from '../../../environments/environment';

@Injectable()
export class ClAuthenticationService {
    public token: string;
    public userData: any = {};
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private http: Http,
                private httpService: HttpService)
    {
        console.log('auth init');
        // set token if saved in local storage
        let clientUser = JSON.parse(localStorage.getItem('clientUser'));
        this.token = clientUser && clientUser.token;
    }

    login(model: FormData): Observable<any> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        
        /* console.log("lo--roro : " + model.get('email'));*/
        console.log("login go");

        return this.httpService.post(environment.base_url + '/api/sign-in', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    register(model: FormData): Observable<any> {
        console.log("roro : " + model.get('email'));
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/register/basic_step', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    register_complete(model: FormData): Observable<any> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/register/next_step', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    register_additional(model: FormData): Observable<any> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/register/complete_step', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    updateProfile(model: FormData): Observable<any> {

        let clientData = JSON.parse(localStorage.getItem('clientUser'));

        let headers = new Headers({ 'Authorization': 'Bearer ' + clientData.token });
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/user/update', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
        /*console.log("up roro1 : " + environment.base_url + '/api/test');

        return this.httpService.post(environment.base_url + '/api/test', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });*/
    }

    verification(code: any): Observable<any> {
        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });

        let fdata = new FormData();
        fdata.append('code' , code);

        return this.httpService.post(environment.base_url + '/api/verify/', fdata, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    forgotPassword(model: any): Observable<any> {
        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/password/send-mail', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    resetPassword(model: any): Observable<any> {
        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });

        return this.httpService.post(environment.base_url + '/api/password/reset', model, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('clientUser');
    }

    setUserData(userObject: any): Observable<any> {
        localStorage.setItem('clientUser', JSON.stringify(userObject));
        // this.userData = userObject;
        return Observable.of(this.userData);
    }

    getUserData(): Observable<any> {
        // let token = this.cookies.getCookie("sessionId");
        
        let sessionUser = localStorage.getItem('clientUser') || null;
        console.log("get user data : " + JSON.stringify(sessionUser));

        return Observable.of(JSON.parse(sessionUser));
    }


}
