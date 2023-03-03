import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthDataService } from '@core/data';
import { UserInfo } from '@core/interfaces/auth.interface';
import {
  LocalStorageService,
  authRoutes,
  localStorageConstant,
  virtualChallengeRoutes,
  VirtualChallengeSharedDataService,
  SessionStorageService,
  DataLayerService,
} from '@core/utils/index';
import { Router } from '@angular/router';
import { ToastService } from '@components/toast/toast.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm', {}) lForm: NgForm;

  public loginData: UserInfo = new UserInfo();
  public authRoutes = authRoutes;

  public show = {
    loginBtnText: 'Login',
    error: null,
  };

  public redirectTo;
  public userData: UserInfo;
  private inputFocusCount = 0;

  constructor(
    private router: Router,
    private authService: AuthDataService,
    private localStorageService: LocalStorageService,
    private sharedDataSerivce: VirtualChallengeSharedDataService,
    public toastService: ToastService,
    private sessionStorageService: SessionStorageService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.pageViewDataLayerEvent();
    this.userData = this.localStorageService.getUser() || null;
    if (this.userData) {
      // this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}`]);
      this.router.navigate([`/`]);
    }
    this.redirectTo = this.localStorageService.get(localStorageConstant.redirectTo) || null;
  }

  login(form) {
    this.show.error = null;
    if (form.invalid) {
      return;
    }
    this.loginData.email = this.loginData.email.toLowerCase();
    this.show.loginBtnText = 'Logging...';
    this.authService.login(this.loginData).subscribe(
      async (data) => {
        data.fullName = `${data.firstName} ${data.lastName}`;
        this.localStorageService.saveUser(data);
        this.localStorageService.saveJwtToken(data.jwtToken);
        this.sharedDataSerivce.setUserData(true);
        const lastUrl = this.sessionStorageService.get(SessionStorageService.REDIRECT_URL_KEY_NAME);
        this.sessionStorageService.remove(SessionStorageService.REDIRECT_URL_KEY_NAME);
        this.router.navigateByUrl(lastUrl || '/');
        // this.checkUserChallenge(data);

        this.dataLayerService.formSubmitEvent({
          formName: 'login',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
          ...this.getDataLayerFormObj(form),
        });
      },
      (err) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'login',
          formStatus: this.dataLayerService.formStatus.FAILED,
          ...this.getDataLayerFormObj(form),
        });
        let errMsg = '';

        if (err.error.message) {
          errMsg = err.error.message;
        }
        this.show.error = errMsg !== '' ? errMsg : 'Oh snap! Something went wrong!';
        this.show.loginBtnText = 'Login';
      },
    );
  }
  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'login',
        ...this.getDataLayerFormObj(form),
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'login',
      ...this.getDataLayerFormObj(form),
    });
  }
  getDataLayerFormObj(form) {
    const formFields = {};
    Object.keys(form.controls).forEach((key) => {
      if (!key.includes('password')) {
        formFields[key] = form.controls[key].value || '';
      }
    });
    return formFields;
  }
  pageViewDataLayerEvent() {
    this.dataLayerService.pageInitEvent({
      screen_name: 'login',
      visitorLoginState: 'logged-out',
      visitorType: 'visitor' + 'logged-out',
      visitorEmail: '',
      pagePostType: 'loginPage',
      pagePostType2: 'single-page',
      user_id: '',
    });
  }
}
