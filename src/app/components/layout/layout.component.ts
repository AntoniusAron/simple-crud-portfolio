import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: "app-layout",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {}
