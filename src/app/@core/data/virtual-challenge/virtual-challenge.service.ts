import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { VirtualChallengeData } from './virtual-challenge-data';
import { StravaUserDetail } from '../../interfaces/auth.interface';
import { VirtualChallengeList } from '../../interfaces/virtual-challenge-event.interface';
import { VirtualChallengeDetail, VirtualChallengeLeaderBoard, VirtualChallengeTeam, VirtualChallengeMember, UserChallengeInfo, VirtualChallengeInvites, AddActivity, VirtualChallengeRunLogs, GetChallengeNotification } from '../../interfaces/virtual-challenge.interface';

@Injectable()
export class VirtualChallengeDataService {
  routename = 'challenge';
  constructor(private http: HttpClient) {}

  getAll() {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}?filter=isDeleted||$eq||0&filter=isActive||eq||1&join=contents&join=eCommerce`;
    url = encodeURI(url);
    return this.http.get<VirtualChallengeDetail[]>(url);
  }
  getChallengeV1ActiveChallenge(profileId) {
    let url = `${environment.RCMS_EVENT_API.CHALLENGE}/31_day_2022?profileId=${profileId}`;
    url = encodeURI(url);
    return this.http.get<VirtualChallengeDetail[]>(url, {
      headers: {
        'x-api-key': environment.RCMS_EVENT_API.KEY,
      },
    });
  }
  getAllVirtualChallanges() {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge`;
    url = encodeURI(url);
    return this.http.get<VirtualChallengeList[]>(url, {
      headers: {
        'x-api-key': environment.RCMS_EVENT_API.KEY,
      },
    });
  }
  getVirtualChallange(id) {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge/${id}`;
    url = encodeURI(url);
    return this.http.get<VirtualChallengeList>(url, {
      headers: {
        'x-api-key': environment.RCMS_EVENT_API.KEY,
      },
    });
  }

  getByid(id) {
    return this.http.get<VirtualChallengeDetail>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/${id}?join=contents&join=eCommerce`);
  }

  getLeaderBoardData(
    challengeId: string,
    challengeMemberId: string,
    isRequiredRawData: boolean = false,
    isProcessedRankData: boolean = true,
  ) {
    return this.http.get<VirtualChallengeLeaderBoard>(
      `${environment.RAGNAR_CHALLENGE}/${this.routename}/leaderboard?challengeId=${challengeId}&challengeMemberId=${challengeMemberId}&isRequiredRawData=${isRequiredRawData}&isProcessedRankData=${isProcessedRankData}`,
    );
  }

  getUserExistingChallenge(profileId: string) {
    return this.http.get<VirtualChallengeDetail>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/existing?profileId=${profileId}`);
  }

  public getVirtualChallengeDates() {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge/challange-basics`;
    url = encodeURI(url);
    return this.http.get<VirtualChallengeData[]>(url);
  }
}

@Injectable()
export class VirtualChallengeTeamDataService {
  routename = 'challenge-team';
  constructor(private http: HttpClient) {}

  getAll() {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}`;
    url = encodeURI(url);
    return this.http.get<VirtualChallengeTeam[]>(url);
  }

  getByid(id: string) {
    return this.http.get<VirtualChallengeTeam>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/${id}`);
  }

  create(data: VirtualChallengeTeam) {
    return this.http.post<VirtualChallengeTeam>(`${environment.RAGNAR_CHALLENGE}/${this.routename}`, data);
  }
  getUserProfileTeams(profileId: string) {
    return this.http.get<VirtualChallengeTeam[]>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/team/profile/${profileId}`);
  }
  getChallengeByProfile(profileId: string) {
    return this.http.get<VirtualChallengeTeam>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/virtual-challenge/team/${profileId}`);
  }
  getRunnersFromTeam(teamId: string) {
    return this.http.get<VirtualChallengeMember[]>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/team/${teamId}/runners`);
  }
  changeTeamName(name: string, challengeTeamId: string) {
    // tslint:disable-next-line: no-any
    return this.http.patch<any>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/${challengeTeamId}/change-name`, { name });
  }
  firstCommentMail(challengeTeamId: string, object: { teamName: string; comment: string; commenter: string }) {
    return this.http.post<unknown>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/team/${challengeTeamId}/feed-mail`, object);
  }
}

@Injectable()
export class VirtualChallengeMemberDataService {
  routename = 'challenge-team-member';
  constructor(private http: HttpClient) {}

  getAll(filters?: { filter: string }) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}`;
    if (filters) {
      url = `${url}?${filters.filter}`;
    }
    url = encodeURI(url);
    return this.http.get<VirtualChallengeMember[]>(url);
  }

  getByid(id: string) {
    return this.http.get<VirtualChallengeMember>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/${id}`);
  }

  updateSeenResult(challengeMemberId: string) {
    // tslint:disable-next-line: no-any
    return this.http.patch<any>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/${challengeMemberId}/update-content`, {
      content: {
        resultSeen: true,
      },
    });
  }

  create(data: VirtualChallengeMember) {
    return this.http.post<VirtualChallengeMember>(`${environment.RAGNAR_CHALLENGE}/${this.routename}`, data);
  }

  getProfileStats(profileId: string) {
    /* TODO: Will fix later once more than one challenge involve untill than few static value will works*/
    return this.http.get<UserChallengeInfo>(`${environment.RAGNAR_CHALLENGE}/${this.routename}/profile/${profileId}`);
  }

  deleteTeamMember(id: string, teamId: string) {
    return this.http.delete<UserChallengeInfo>(
      `${environment.RAGNAR_CHALLENGE}/${this.routename}/${id}?challengeTeamId=${teamId}&challengeTeamMemberId=${id}`,
    );
  }
}

@Injectable()
export class VirtualChallengeCommunityService {
  routename = 'challenge';
  constructor(private http: HttpClient) {}

  getActivities(id: string) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}/community/${id}`;
    url = encodeURI(url);
    return this.http.get<VirtualChallengeMember[]>(url);
  }
}

@Injectable()
export class VirtualChallengeInviteDataService {
  routename = 'challenge-invite';
  constructor(private http: HttpClient) {}
  /* TODO: Not using anywhere
  getAll(filters?: unknown) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}`;
    if (filters) {
      url = `${url}&${filters.filter}`;
    }
    url = encodeURI(url);
    return this.http.get<VirtualChallengeInvites[]>(url);
  } */

  createBulk(challengeId: string, challengeTeamId: string, data: VirtualChallengeInvites[], invitedBy: string, checkMail: boolean) {
    const bulkData = {
      bulk: data,
    };

    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}/bulk?`;

    if (invitedBy) {
      url = `${url}&invitedBy=${invitedBy}`;
    }
    if (challengeId) {
      url = `${url}&challengeId=${challengeId}`;
    }

    if (challengeTeamId) {
      url = `${url}&challengeTeamId=${challengeTeamId}`;
    }
    url = `${url}&checkMail=${checkMail}`;

    url = encodeURI(url);
    return this.http.post<VirtualChallengeInvites[]>(url, bulkData);
  }

  getPendingInvites(email: string) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}/existing/?`;
    if (email) {
      url = `${url}email=${encodeURIComponent(email)}`;
    }
    url = encodeURI(url);
    return this.http.get<VirtualChallengeInvites[]>(url);
  }

  delete(id: string) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}/existing/${id}`;
    url = encodeURI(url);
    return this.http.delete<VirtualChallengeInvites>(url);
  }
  getAllChallengeInvites(challengeTeamId: string) {
    const url = `${environment.RAGNAR_CHALLENGE}/${this.routename}?filter=challengeTeamId||$eq||${challengeTeamId}&filter=status||$eq||INVITED`;
    return this.http.get<VirtualChallengeInvites[]>(url);
  }
  resendChallengeInvite(inviteId: string, invitedTo: string, invitedBy: string, challengeTeamId: string, challengeId: string) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}/${inviteId}/resend?`;
    url = `${url}inviteId=${inviteId}&invitedTo=${invitedTo.replace(
      '+',
      '%2B',
    )}&invitedBy=${invitedBy}&challengeTeamId=${challengeTeamId}&challengeId=${challengeId}`;
    return this.http.get(url);
  }
}

@Injectable()
export class VirtualChallengeUtilDataService {
  constructor(private http: HttpClient) {}

  addActivity(data) {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge-activity`;
    url = encodeURI(url);
    return this.http.post<AddActivity>(url, data);
  }

  updateActivity(data) {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge-activity/${data.id}`;
    url = encodeURI(url);
    return this.http.patch<AddActivity>(url, data);
  }

  getActivities(filters) {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge-activity?`;
    if (filters.filter) {
      url = `${url}&${filters.filter}`;
    }
    if (filters.sort) {
      url = `${url}&${filters.sort}`;
    }
    url = encodeURI(url);
    return this.http.get<VirtualChallengeRunLogs[]>(url);
  }

  deleteActivity(id) {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge-activity/${id}`;
    url = encodeURI(url);
    return this.http.delete<unknown>(url);
  }

  generateOrder(orderDetails) {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge-order/generate`;
    url = encodeURI(url);
    return this.http.post<unknown>(url, orderDetails);
  }
  getOrder(challengeId, profileId) {
    let url = `${environment.RAGNAR_CHALLENGE}/challenge-order/status?challengeId=${challengeId}&profileId=${profileId}`;
    url = encodeURI(url);
    return this.http.get<unknown>(url);
  }

  stravaAuthorize() {
    // window.location.href = `http://www.strava.com/oauth/authorize?client_id=${
    //   environment.STRAVA.CLIENT_ID
    // }&response_type=code&redirect_uri=${window.location.href.replace(
    //   /#\w+\s*/,
    //   '',
    // )}&approval_prompt=force&scope=read,read_all,profile:read_all,profile:write,activity:read_all,activity:write`;
  }

  connectToStravaProfile(data) {
    return this.http.post<StravaUserDetail>(`${environment.STRAVA.API_URL}/oauth/token`, data);
  }
  /* TODO: Not using below api call anywhere
  getStravaUserActivities(authToken?, afterTime?, beforeTime?, perPage?) {
    let url = `${environment.STRAVA.API_URL}/athlete/activities?`;
    if (afterTime) {
      url = `${url}&after=${afterTime}`;
    }
    if (beforeTime) {
      url = `${url}&before=${beforeTime}`;
    }
    if (perPage) {
      url = `${url}&per_page=${perPage}`;
    }

    return this.http.get<any[]>(url, { headers: new HttpHeaders({ Authorization: `Bearer ${authToken}` }) });
  } */

  getStravaTokenUsingRefreshToken(refreshToken) {
    const data = {
      client_id: environment.STRAVA.CLIENT_ID,
      client_secret: environment.STRAVA.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    return this.http.post<StravaUserDetail>(`${environment.STRAVA.API_URL}/oauth/token`, data);
  }
}

@Injectable()
export class VirtualChallengeNotificationService {
  routename = 'challenge-notification';
  constructor(private http: HttpClient) {}

  getNotifications(filters?: { filter: string; sort: string }) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}?`;
    if (filters.filter) {
      url = `${url}&${filters.filter}`;
    }
    if (filters.sort) {
      url = `${url}&${filters.sort}`;
    }
    url = encodeURI(url);
    return this.http.get<GetChallengeNotification[]>(url);
  }

  setNotificationRead(data) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}/${data.id}`;

    url = encodeURI(url);
    return this.http.patch(url, data);
  }

  setAllNotificationRead(challengeMemberId) {
    let url = `${environment.RAGNAR_CHALLENGE}/${this.routename}/clear/${challengeMemberId}`;

    url = encodeURI(url);
    return this.http.get(url);
  }
}
