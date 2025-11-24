import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class VoucherService {
    private apiUrl = 'http://localhost:3000/api/vales';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getVouchers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    generateVoucher(type: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { type }, { headers: this.getHeaders() });
    }

    getAudit(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/audit`, { headers: this.getHeaders() });
    }

    generateExtra(type: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/extra`, { type }, { headers: this.getHeaders() });
    }

    redeemVoucher(code: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/redeem`, { code }, { headers: this.getHeaders() });
    }
}
