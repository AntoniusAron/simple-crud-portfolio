import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: "app-root",
  imports: [RouterOutlet, RouterModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "simple_crud";

}
