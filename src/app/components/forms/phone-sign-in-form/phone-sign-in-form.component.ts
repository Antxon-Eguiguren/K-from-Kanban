import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { WindowService } from 'src/app/services/window.service';
import { UserService } from 'src/app/services/user.service';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

@Component({
  selector: 'app-phone-sign-in-form',
  templateUrl: './phone-sign-in-form.component.html',
  styleUrls: ['./phone-sign-in-form.component.scss'],
})
export class PhoneSignInFormComponent implements AfterViewInit {
  windowRef: any;
  isValidCaptcha = false;
  isOTPSent = false;
  @Output() phoneSignIn = new EventEmitter<boolean>();

  sendOTPForm = this.formBuilder.group({
    name: [, Validators.required],
    email: [, Validators.required],
    phoneNumber: [, Validators.required],
  });

  verifyOTPForm = this.formBuilder.group({
    otp: [, Validators.required],
  });

  constructor(
    private userService: UserService,
    private windowService: WindowService,
    private formBuilder: FormBuilder
  ) {
    this.windowRef = this.windowService.windowRef;
  }

  ngAfterViewInit(): void {
    const auth = getAuth();
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'normal',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.isValidCaptcha = true;
        },
      },
      auth
    );
    this.windowRef.recaptchaVerifier.render();
  }

  async onSubmitSendOTP(): Promise<void> {
    const auth = getAuth();
    try {
      this.windowRef.confirmationResult = await signInWithPhoneNumber(
        auth,
        this.sendOTPForm.controls['phoneNumber'].value,
        this.windowRef.recaptchaVerifier
      );
      this.isOTPSent = true;
    } catch (error) {
      // Error, SMS not sent
      console.log(error);
    }
  }

  async onSubmitVerifyOTP(): Promise<void> {
    try {
      const result = await this.windowRef.confirmationResult.confirm(
        this.verifyOTPForm.controls['otp'].value
      );

      // User signed in successfully
      result.user.displayName = this.sendOTPForm.controls['name'].value;
      result.user.email = this.sendOTPForm.controls['email'].value;
      result.user.photoURL =
        'https://avatars.githubusercontent.com/u/39241600?v=4';
      this.userService.checkUser();
    } catch (error) {
      // User couldn't sign in (bad verification code?)
      console.log(error);
    }
  }

  goBack(): void {
    this.phoneSignIn.emit(false);
  }
}
