import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const userData = localStorage.getItem('user');
        console.log('Loading user from storage:', userData);
        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log('Parsed user:', user);
                this.currentUserSubject.next(user);
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('user');
            }
        }
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(response => {
                console.log('Login response:', response);
                if (response && response.accessToken) {
                    // Normalize the response to use 'token' internally
                    const userData = {
                        ...response,
                        token: response.accessToken
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    this.currentUserSubject.next(userData);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        try {
            const userStr = localStorage.getItem('user');
            console.log('Getting token, user string:', userStr);
            if (!userStr) return null;
            const user = JSON.parse(userStr);
            console.log('Parsed user for token:', user);
            console.log('Token:', user.token);
            return user.token || null;
        } catch (e) {
            console.error('Error getting token:', e);
            return null;
        }
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
}
