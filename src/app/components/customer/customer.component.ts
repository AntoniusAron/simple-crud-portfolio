import { Component } from '@angular/core';
import { Customer, ICustomerList } from '../../model/customer';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: "app-customer",
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: "./customer.component.html",
  styleUrl: "./customer.component.css",
})
export class CustomerComponent {
  isPanelOpen = false;
  customerModelData: Customer = new Customer();
  customerList: ICustomerList[] = [];
  customerForm: FormGroup = new FormGroup({
    customerName: new FormControl("", [Validators.required,Validators.minLength(3)]),
    customerCity: new FormControl("", [Validators.required,Validators.minLength(3)]),
    mobileNo: new FormControl("", [Validators.required, Validators.minLength(10), this.phoneValidator]),
    email: new FormControl("", [Validators.required, Validators.minLength(6), Validators.email]),
  });
  actionMode: string = "new";

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {
    const isValid = this.customerForm.valid;
    this.getAllCustomers();
  }

  ngOnInit() {}

  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe(
      (result: any) => {
        this.customerList = result.data; // If successful, assign the data to customerList
      },
      (error) => {
        alert("There was an error loading the customer data."); // Set an error message if request fails
      }
    );
  }
  openPanel() {
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    // Allow empty value to let 'required' validator handle it
    if (value === null || value === "") return null;

    const number = Number(value);

    if (isNaN(number)) {
      return { notANumber: true };
    }

    if (!Number.isInteger(number)) {
      return { notInteger: true };
    }

    if (number <= 0) {
      return { notPositive: true };
    }
    return null; // Valid phone number
  }

  get customerName() {
    return this.customerForm.get("customerName");
  }

  get customerCity() {
    return this.customerForm.get("customerCity");
  }

  get mobileNo() {
    return this.customerForm.get("mobileNo");
  }

  get email() {
    return this.customerForm.get("email");
  }

  onButtonEdit(data: any) {
    this.customerModelData = data;
    this.setActionMode("update");
    this.fillForm();
    this.openPanel();
  }

  onCreateNew() {
    this.customerModelData = new Customer();
    this.setActionMode("new");
    this.fillForm();
    this.openPanel();
  }

  fillForm() {
    this.customerForm.setValue({
      customerName: this.customerModelData.customerName,
      customerCity: this.customerModelData.customerCity,
      mobileNo: this.customerModelData.mobileNo,
      email: this.customerModelData.email,
    });
  }

  onButtonDelete(customerId: number) {
    const isDelete = confirm("Are you sure want to delete?");
    if (isDelete == true) {
      this.customerService.onDeleteCustomer(customerId).subscribe(
        (result: any) => {
          this.closePanel();
          this.getAllCustomers();
          this.toastr.success(
            "Customer Data has been deleted(" + result.data.customerName + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error delete customer data."); // Set an error message if request fails
        }
      );
    }
  }

  onSave(action: string) {
    this.customerModelData = {
      ...this.customerModelData,
      ...this.customerForm.value,
    };
    debugger;
    if (action == "new") {
      this.customerService.onSaveNewCustomer(this.customerModelData).subscribe(
        (result: any) => {
          this.customerModelData = result.data;
          this.closePanel();
          this.getAllCustomers();
          this.toastr.success(
            "Customer Data has been created(" + result.data.brand + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error create customer data."); // Set an error message if request fails
        }
      );
    } else if (action == "update") {
      this.customerService.onUpdateCustomer(this.customerModelData).subscribe(
        (result: any) => {
          this.customerModelData = result.data;
          this.closePanel();
          this.getAllCustomers();
          this.toastr.success(
            "Customer Data has been updated(" + result.data.brand + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error update customer data."); // Set an error message if request fails
        }
      );
    }
  }

  setActionMode(actionMode: string) {
    this.actionMode = actionMode;
  }
}
