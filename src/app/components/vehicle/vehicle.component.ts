import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Car, ICarList } from '../../model/car';
import { CarService } from '../../services/car.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-vehicle",
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: "./vehicle.component.html",
  styleUrl: "./vehicle.component.css",
})
export class VehicleComponent implements OnInit {
  isPanelOpen = false;
  carModelData: Car = new Car();
  carList: ICarList[] = [];
  carForm: FormGroup = new FormGroup({
    regNo: new FormControl("", [Validators.required, Validators.minLength(3)]),
    brand: new FormControl("", [Validators.required, Validators.minLength(3)]),
    model: new FormControl("", [Validators.required, Validators.minLength(3)]),
    year: new FormControl(null, [Validators.required, this.yearValidator]),
    dailyRate: new FormControl(null, this.numberValidator),
    carImage: new FormControl(),
  });
  actionMode: string = "new";

  constructor(private carService: CarService, private toastr: ToastrService) {
    const isValid = this.carForm.valid;
    this.getAllCars();
  }

  ngOnInit() {
    // this.carService.getAllCars().subscribe(
    //   (data:any) => {
    //     this.carList = data; // If successful, assign the data to carList
    //   },
    //   (error) => {
    //     alert("There was an error loading the car data."); // Set an error message if request fails
    //   }
    // );
  }

  getAllCars() {
    this.carService.getAllCars().subscribe(
      (result: any) => {
        this.carList = result.data; // If successful, assign the data to carList
      },
      (error) => {
        alert("There was an error loading the car data."); // Set an error message if request fails
      }
    );
  }
  openPanel() {
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  numberValidator(control: AbstractControl): ValidationErrors | null {
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

    return null; // Valid
  }

  yearValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Allow empty value to let 'required' validator handle it
    if (value === null || value === "") return null;

    const year = Number(value);
    const currentYear = new Date().getFullYear();

    if (isNaN(year)) {
      return { notANumber: true };
    }

    if (!Number.isInteger(year)) {
      return { notInteger: true };
    }

    if (year < 0) {
      return { notPositive: true };
    }

    if (year < 1900) {
      return { minValue: true };
    }

    if (year > currentYear) {
      return { maxValue: true };
    }

    return null; // Valid
  }

  get regNo() {
    return this.carForm.get("regNo");
  }

  get brand() {
    return this.carForm.get("brand");
  }

  get model() {
    return this.carForm.get("model");
  }

  get year() {
    return this.carForm.get("year");
  }

  get dailyRate() {
    return this.carForm.get("dailyRate");
  }

  get carImage() {
    return this.carForm.get("carImage");
  }

  onButtonEdit(data: any) {
    this.carModelData = data;
    this.setActionMode("update");
    this.fillForm();
    this.openPanel();
  }

  onCreateNew() {
    this.carModelData = new Car();
    this.setActionMode("new");
    this.fillForm();
    this.openPanel();
  }

  fillForm() {
    this.carForm.setValue({
      regNo: this.carModelData.regNo,
      brand: this.carModelData.brand,
      model: this.carModelData.model,
      year: this.carModelData.year,
      dailyRate: this.carModelData.dailyRate,
      carImage: this.carModelData.carImage,
    });
  }

  onButtonDelete(carId: number) {
    const isDelete = confirm("Are you sure want to delete?");
    if (isDelete == true) {
      this.carService.onDeleteCar(carId).subscribe(
        (result: any) => {          
          this.closePanel();
          this.getAllCars();
          this.toastr.success(
            "Car Data has been deleted(" + result.data.brand + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error delete car data."); // Set an error message if request fails
        }
      );
    }
  }

  onSave(action: string) {
    this.carModelData = {
      ...this.carModelData,
      ...this.carForm.value,
    };
    if (action == "new") {
      this.carService.onSaveNewCar(this.carModelData).subscribe(
        (result: any) => {
          this.carModelData = result.data;
          this.closePanel();
          this.getAllCars();
          this.toastr.success(
            "Car Data has been created(" + result.data.brand + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error create car data."); // Set an error message if request fails
        }
      );
    } else if (action == "update") {
      this.carService.onUpdateCar(this.carModelData).subscribe(
        (result: any) => {
          this.carModelData = result.data;
          this.closePanel();
          this.getAllCars();
          this.toastr.success(
            "Car Data has been updated(" + result.data.brand + ")"
          );
        },
        (error) => {
          this.toastr.error("There was an error update car data."); // Set an error message if request fails
        }
      );
    }
  }

  setActionMode(actionMode: string) {
    this.actionMode = actionMode;
  }
}
