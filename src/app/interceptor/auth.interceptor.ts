import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);
  
  if (req.url.includes("/JWT")) {
    return next(req);
  }

  if(!token) {
    return next(req);
  }

  try {
    // Decode payload JWT
    const payload = JSON.parse(atob(token.split(".")[1]));      
    const now = Math.floor(Date.now() / 1000);

    // This part to show token's remaining time left 
    // const exp = payload.exp;
    // const remaining = exp - now;

    // alert(`Token remaining time: ${remaining} seconds`);


    if (payload.exp < now) {
      const isContinue = confirm("Token expired. Try to refresh?");
      if (isContinue) {
        const loggedData = authService.getTokenDataSafe();

        if (!loggedData) {
          authService.clearToken();
          router.navigate(["/login"]);
          return throwError(() => new Error('No token data'));
        }

        const refreshObj = {
          emailId: loggedData.emailId,
          token: loggedData.token,
          refreshToken: loggedData.refreshToken,
        };

        return authService.refreshToken(refreshObj).pipe(
          switchMap((newToken: any) => {
            authService.setToken(newToken.data);
            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(clonedReq);
          }),
          catchError((err) => {
            console.error('Refresh token failed:', err);
            authService.clearToken();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      } else {
        authService.clearToken();
        router.navigate(["/login"]);
      }
    }

    // if there is token check in Back End
    let authReq = req;
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn("401 from server");
          authService.clearToken();
          router.navigate(["/login"]);
        }
        return throwError(() => error);
      })
    );
  } catch (e) {
    console.warn("Token invalid");
    router.navigate(["/login"]);
    return throwError(() => new Error("Token invalid"));
  }

};
