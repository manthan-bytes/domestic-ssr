import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DashboardBehviourSubject, GetChallengeNotification } from '@core/interfaces/virtual-challenge.interface';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class VirtualChallengeSharedDataService {
  private dashboardMenu: BehaviorSubject<DashboardBehviourSubject | boolean | DashboardBehviourSubject[]> = new BehaviorSubject<
    DashboardBehviourSubject | boolean | DashboardBehviourSubject[]
  >(null);

  private user: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private virtualChallengeNotifications: BehaviorSubject<boolean | GetChallengeNotification> = new BehaviorSubject<
    boolean | GetChallengeNotification
  >(null);

  public getDashboardMenu() {
    return this.dashboardMenu.asObservable();
  }

  public setDashboardMenu(dashboardMenu: DashboardBehviourSubject | DashboardBehviourSubject[] | boolean): void {
    this.dashboardMenu.next(dashboardMenu);
  }

  public getUserData(): Observable<string> {
    return this.user.asObservable();
  }

  public setUserData(userData): void {
    this.user.next(userData);
  }

  public getNotifications() {
    return this.virtualChallengeNotifications.asObservable();
  }

  public setNotifications(notifications): void {
    this.virtualChallengeNotifications.next(notifications);
  }

  public checkRunLogs(runLogs = []) {
    const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
    return runLogs.map((log) => {
      const logDate = moment.utc(log.logDate).add({ hours: 24 });
      // tslint:disable-next-line: no-string-literal
      log['isUndar24Hr'] = today.isAfter(logDate) ? false : true;
      return log;
    });
  }
}
