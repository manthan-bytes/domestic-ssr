import { Component, OnInit } from '@angular/core';
import { UserInfo } from '@core/interfaces/auth.interface';
import { AuthDataService } from '@core/data';
import { authRoutes, DataLayerService, LocalStorageService, virtualChallengeRoutes } from '@core/utils';
import { ToastService } from '@components/toast/toast.service';
import { Router } from '@angular/router';
import { ForgotPassword } from '@core/interfaces/common.interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public authRoutes = authRoutes;

  public show = {
    error: null,
    loading: false,
  };
  private userData;
  private inputFocusCount = 0;
  constructor(
    private router: Router,
    private authService: AuthDataService,
    public toastService: ToastService,
    private localStorageService: LocalStorageService,
    private dataLayerService: DataLayerService,
  ) {}

  public forgotPasswordData: UserInfo = new UserInfo();

  ngOnInit() {
    this.pageViewDataLayerEvent();
    this.userData = this.localStorageService.getUser() || null;
    if (this.userData) {
      this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}`]);
    }
  }

  forgotPassword(form) {
    if (form.invalid) {
      return;
    }
    this.forgotPasswordData.email = this.forgotPasswordData.email.toLowerCase();
    const data = {
      email: this.forgotPasswordData.email,
    };
    this.show.loading = true;
    this.authService.forgotPassowrd(data).subscribe(
      (response: ForgotPassword) => {
        this.toastService.clear();
        this.toastService.show(response.msg, { classname: 'bg-dark text-light', delay: 3000 });
        this.show.loading = false;
        this.dataLayerService.formSubmitEvent({
          formName: 'forgot_password',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
          email: this.forgotPasswordData.email,
        });
      },
      (err) => {
        this.show.error = err.error.code === 'UserNotFoundException';
        this.show.loading = false;
        this.dataLayerService.formSubmitEvent({
          formName: 'forgot_password',
          formStatus: this.dataLayerService.formStatus.FAILED,
          email: this.forgotPasswordData.email,
        });
      },
    );
  }
  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'forgot_password',
        email: this.forgotPasswordData.email,
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'forgot_password',
      email: this.forgotPasswordData.email,
    });
  }
  pageViewDataLayerEvent() {
    this.dataLayerService.pageInitEvent({
      screen_name: 'forgot_password',
      visitorLoginState: 'logged-out',
      visitorType: 'visitor' + 'logged-out',
      visitorEmail: '',
      pagePostType: 'forgotPasswordPage',
      pagePostType2: 'single-page',
      user_id: '',
    });
  }
}
