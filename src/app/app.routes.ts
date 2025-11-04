import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { CustomerComponent } from './components/customer/customer.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "vehicle",
        component: VehicleComponent,
        canActivate: [authGuard],
      },
      {
        path: "customer",
        component: CustomerComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
