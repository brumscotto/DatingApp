import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter<boolean>();

  registerForm!: FormGroup;

  maxDate!: Date;

  validationErrors: string[] = [];

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      username: [null,Validators.required],
      password: [null,[
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ]],
      confirmPassword:[null,
        [ Validators.required,
          this.matchValues('password')
        ]]
    })

    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value ? null : {matchInvalid : true}
    }
  }

  register() {
    // console.log(this.registerForm);
    console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe({
      next: response => {
        this.router.navigateByUrl('/members');
      },
      error: error => {
        console.log(error)
        this.validationErrors = error
      }
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
