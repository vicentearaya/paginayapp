import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    public user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    public get currentUserValue() {
        return this.userSubject.value;
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(user => {
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    private getUserFromStorage() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getToken() {
        return this.currentUserValue?.accessToken;
    }
}
