import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../../utils/local-storage.service';
import { RcmsEventDetail, ClassificationAndDivision } from '../../interfaces/rcms-event-details.interface';
import { TeamAndRunnerInformation, InvitedUser, Team } from '../../interfaces/rcms-team-runner-information.interface';

@Injectable()
export class RCMSEventDataService {
  private static eventCache = {
    ongoing: null,
    past: null,
  };

  private requestOptions: object;

  private API_URL = environment.RCMS_EVENT_API;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    const headers = { 'x-api-key': environment.RCMS_EVENT_API.KEY, Authorization: this.localStorageService.getToken() || null };
    if (!this.localStorageService.getToken()) {
      delete headers.Authorization;
    }
    this.requestOptions = {
      headers: new HttpHeaders(headers),
    };
  }

  getUserEvent(status, order) {
    if (status === 'ongoing' && RCMSEventDataService.eventCache.ongoing && RCMSEventDataService.eventCache.ongoing.length) {
      return of(RCMSEventDataService.eventCache.ongoing);
    } else if (status === 'past' && RCMSEventDataService.eventCache.past && RCMSEventDataService.eventCache.past.length) {
      return of(RCMSEventDataService.eventCache.past);
    } else {
      return this.fetchUserEvents(status, order);
    }
  }

  fetchUserEvents(status = 'all', order = 'startDate') {
    const userData = this.localStorageService.getUser();
    let url = `${this.API_URL.REGISTRATION}/events/${userData.id}?status=${status}`;
    if (userData.emailAddress) {
      url = `${url}&email=${encodeURIComponent(userData.emailAddress)}`;
    }
    if (order) {
      url = `${url}&order=${encodeURIComponent(order)}`;
    }
    return this.http.get<RcmsEventDetail[]>(url, this.requestOptions).pipe(
      map(
        (result) => {
          if (status === 'ongoing') {
            RCMSEventDataService.eventCache.ongoing = result;
          } else if (status === 'past') {
            RCMSEventDataService.eventCache.past = result;
          }
          return result;
        },
        (error) => {
          return error;
        },
      ),
    );
  }

  getTeamAndRunnerInformation(regID: string, role?: string) {
    const userData = this.localStorageService.getUser();
    let url = `${this.API_URL.REGISTRATION}/${regID}/events/${userData.id}?`;
    if (role) {
      url = `${url}&type=${role}`;
    }
    url = encodeURI(url);
    return this.http.get<TeamAndRunnerInformation>(url, this.requestOptions);
  }

  getEventClassifications(regID: string) {
    let url = `${this.API_URL.TEAMS}/${regID}/classifications`;
    url = encodeURI(url);
    return this.http.get<ClassificationAndDivision[]>(url, this.requestOptions);
  }

  getEventDivsions(regID: string) {
    let url = `${this.API_URL.TEAMS}/${regID}/divisions`;
    url = encodeURI(url);
    return this.http.get<ClassificationAndDivision[]>(url, this.requestOptions);
  }

  getEventPrices(regID: string) {
    let url = `${this.API_URL.REG_CONFIG}/${regID}/prices`;
    url = encodeURI(url);
    return this.http.get<unknown>(url, this.requestOptions);
  }

  getInvitedUsers(registrationConfigId, teamId, status) {
    let url = `${this.API_URL.TEAM_CENTER}/${registrationConfigId}/invite/${teamId}?`;
    if (status) {
      url = `${url}&status=${status}`;
    }
    url = encodeURI(url);
    return this.http.get<InvitedUser[]>(url, this.requestOptions);
  }

  editTeam(teamData) {
    const teamUpdateData = {
      classification: teamData.classification,
      division: teamData.division,
      name: teamData.name,
      runOption: teamData.runOption,
      isGlampingPurchased: teamData.isGlampingPurchased,
    };
    let url = `${this.API_URL.TEAMS}/${teamData.registrationConfigId}/teams/${teamData.id}`;
    url = encodeURI(url);
    return this.http.put<unknown>(url, teamUpdateData, this.requestOptions);
  }

  resendEmail(invitationId) {
    let url = `${this.API_URL.TEAM_CENTER}/resendInvitation/${invitationId}`;
    url = encodeURI(url);
    return this.http.get<unknown>(url, this.requestOptions);
  }

  assignRunnerOrder(registrationConfigId, teamId, data) {
    let url = `${this.API_URL.REGISTRATION}/${registrationConfigId}/registrations/assignOrder/${teamId}`;
    url = encodeURI(url);
    return this.http.put<unknown>(url, data, this.requestOptions);
  }

  inviteUserByEmails(registrationConfigId, teamId, data) {
    let url = `${this.API_URL.TEAM_CENTER}/${registrationConfigId}/invite/${teamId}`;
    url = encodeURI(url);
    return this.http.post<unknown>(url, data, this.requestOptions);
  }

  deleteJoinedUser(registrationConfigId, runnerId) {
    let url = `${this.API_URL.REGISTRATION}/${registrationConfigId}/registrations/${runnerId}`;
    url = encodeURI(url);
    return this.http.delete<unknown>(url, this.requestOptions);
  }

  deleteInvitedUser(registrationConfigId, invitationId) {
    let url = `${this.API_URL.TEAM_CENTER}/${registrationConfigId}/invitation/${invitationId}`;
    url = encodeURI(url);
    return this.http.delete<unknown>(url, this.requestOptions);
  }

  createOrder(registrationConfigId, data) {
    let url = `${this.API_URL.REG_CONFIG}/${registrationConfigId}/orders/additionalFees`;
    url = encodeURI(url);
    return this.http.post<unknown>(url, data, this.requestOptions);
  }
  createGlampingOrder(registrationConfigId, data) {
    let url = `${this.API_URL.REG_CONFIG}/${registrationConfigId}/glamping-order`;
    url = encodeURI(url);
    return this.http.post<unknown>(url, data, this.requestOptions);
  }
  getGlammpingCount(registrationConfigId) {
    let url = `${this.API_URL.GLAMPING}/list`;
    if (registrationConfigId) {
      url = `${url}?registrationConfigId=${registrationConfigId}`;
    }
    url = encodeURI(url);

    return this.http.get<unknown>(url, this.requestOptions);
  }
  applyPromocode(registrationConfigId, data, code) {
    let url = `${this.API_URL.REG_CONFIG}/${registrationConfigId}/orders/calculate?isGlamping=${code.isGlampping}`;
    url = encodeURI(url);
    return this.http.post<unknown>(url, data, this.requestOptions);
  }

  updateProfilesRegistration(data) {
    const parsedData = {
      pace: data.runPace,
      tShirtSize: data.shirtSize,
      phone: data.phone,
      address: data.address,
      address2: data.address2,
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      state: data.state,
      bornAt: data.bornAt,
      zipCode: data.zipCode,
    };
    let url = `${this.API_URL.REGISTRATION}/profiles/${data.id}`;
    url = encodeURI(url);
    return this.http.put<unknown>(url, parsedData, this.requestOptions);
  }

  submitCheckIn(data) {
    const parsedData = {
      van1Phone: data.van1Phone,
      van2Phone: data.van2Phone,
      captainEmail: data.captainEmail,
      raceName: data.raceName,
    };
    let url = `${this.API_URL.TEAMS}/${data.registrationConfigId}/teams/checkin/${data.teamId}`;
    url = encodeURI(url);
    return this.http.put<Team>(url, parsedData, this.requestOptions);
  }
  submitRunnerCheckin(data) {
    const runnerData: { type: string; waiver: string; venueWaiver: string; confirmation: string } = {
      type: 'COVID',
      waiver: data.check_in_waiver,
      venueWaiver: '',
      confirmation: '',
    };
    if (data.venue_check_in_waiver) {
      runnerData.venueWaiver = data.venue_check_in_waiver;
    } else {
      delete runnerData.venueWaiver;
    }
    if (data.race_check_in_confirmation) {
      runnerData.confirmation = data.race_check_in_confirmation;
    } else {
      delete runnerData.confirmation;
    }

    let url = `${this.API_URL.REGISTRATION}/registrations/${data.runnerId}/checkin-runner`;
    url = encodeURI(url);
    return this.http.post(url, runnerData, this.requestOptions);
  }

  clearUserEventCache() {
    RCMSEventDataService.eventCache.ongoing = null;
    RCMSEventDataService.eventCache.past = null;
  }
}
