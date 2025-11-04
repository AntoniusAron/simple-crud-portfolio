import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  userName: FormControl = new FormControl("", Validators.required);
  password: FormControl = new FormControl("", Validators.required);

  router = inject(Router);

  constructor(private toastr: ToastrService, private loginServ: LoginService) {}

  onLogin() {
    if (this.userName.invalid || this.password.invalid) {
      this.toastr.error("Username and Password are required!");
      return;
    }
    
    const apiLoginObj = {
      EmailId: this.userName.value,
      Password: this.password.value,
    };

    this.loginServ.loginUser(apiLoginObj).subscribe(
      (result: any) => {
        localStorage.setItem("angular19User", result.data.userId);
        localStorage.setItem("angular19Token", result.data.token);
        localStorage.setItem("angular19TokenData", JSON.stringify(result.data));
        this.router.navigateByUrl("vehicle");
      },
      (error) => {
        alert("Wrong credentials");
      }
    );
  }
}
