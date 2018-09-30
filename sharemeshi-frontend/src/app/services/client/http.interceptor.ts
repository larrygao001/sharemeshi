import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpService extends Http {

    constructor(backend: XHRBackend, options: RequestOptions, public router: Router) {
        super(backend, options);
        // let token = localStorage.getItem('auth_token'); // your custom token getter function here
        // options.headers.set('Authorization', `Bearer ${token}`);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoader();
        return super.get(url, this.getRequestOptionArgs(options))
            .do((res: Response) => {
                this.hideLoader();
            }, (error: any) => {
                if (error) {
                    this.router.navigate(['/']);
                }
                this.hideLoader();
            })
            .finally(() => {
                // console.log('Finally')
            });
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoader();
        return super.post(url, body, this.getRequestOptionArgs(options))
            .do((res: Response) => {
                this.hideLoader();
            }, (error: any) => {
                if (error) {
                    this.router.navigate(['/']);
                }
                this.hideLoader();
            })
            .finally(() => {
                // console.log('Finally')
            });
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoader();
        return super.put(url, body, this.getRequestOptionArgs(options)).do((res: Response) => {
            this.hideLoader();
        }, (error: any) => {
            if (error) {
                this.router.navigate(['/home']);
            }
            this.hideLoader();
        })
        .finally(() => {
            // console.log('Finally')
        });
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoader();
        return super.delete(url, this.getRequestOptionArgs(options)).do((res: Response) => {
            this.hideLoader();
        }, (error: any) => {
            if (error) {
                this.router.navigate(['/home']);
            }
            this.hideLoader();
        })
        .finally(() => {
        });
    }

    public getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (localStorage.getItem('clientUser') != null) {
            try {
                if (!options.headers.has('Authorization')) {
                    options.headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('clientUser'))['sessionId']);
                }
            } catch (e) {
                console.log(e);
            }
        }
        return options;
    }

    private onEnd(): void {
        // this.store.dispatch({ type: 'HIDELOADER' })
    }

    private showLoader(): void {
        // this.store.dispatch({ type: 'SHOWLOADER' })
    }

    private hideLoader(): void {
        // this.store.dispatch({ type: 'HIDELOADER' })
    }

}
