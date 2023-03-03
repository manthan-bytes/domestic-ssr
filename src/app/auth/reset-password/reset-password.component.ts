import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthDataService } from '@core/data';
import { DataLayerService } from '@core/utils';
import { authRoutes } from '@core/utils/routes-path.constant.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public show = {
    loading: false,
    accountError: null,
    passwordError: null,
  };
  private inputFocusCount = 0;

  public params: { email: string; verificationCode: string; newPassword?: string };

  public resetpassword: string;
  constructor(
    private authDataService: AuthDataService,
    private router: Router,
    private route: ActivatedRoute,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit() {
    this.pageViewDataLayerEvent();
    this.route.params.subscribe((params: { email: string; verificationCode: string; newPassword?: string }) => {
      this.params = params;
    });
  }

  submitResetPassword(resetpassword: string) {
    this.show.loading = true;
    const data = { ...this.params, newPassword: resetpassword };
    this.authDataService.confirmPassword(data).subscribe(
      (response) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'forgot_password',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
        });
        this.show.loading = false;
        this.router.navigate([`/${authRoutes.main}/${authRoutes.login}`]);
      },
      (err) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'forgot_password',
          formStatus: this.dataLayerService.formStatus.FAILED,
        });
        this.show.loading = false;
        if (err.error && err.error.message) {
          // tslint:disable-next-line: no-string-literal
          this.show.accountError = err.error['message'];
        } else {
          this.show.accountError = 'Oh snap! Something went wrong!';
        }
      },
    );
  }

  // static logged-out as we are in auth pages
  pageViewDataLayerEvent() {
    this.dataLayerService.pageInitEvent({
      screen_name: 'reset_password',
      visitorLoginState: 'logged-out',
      visitorType: 'visitor' + 'logged-out',
      visitorEmail: '',
      pagePostType: 'resetPasswordPage',
      pagePostType2: 'single-page',
      user_id: '',
    });
  }
}
