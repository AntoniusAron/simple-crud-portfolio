import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: "app-layout",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {
  router = inject(Router);
  authServ = inject(AuthService);

  onLogOut() {
    this.authServ.clearToken();
    this.router.navigateByUrl("login");
  }
}
