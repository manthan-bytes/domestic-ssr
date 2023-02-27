import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseService {
  constructor(private fireDb: AngularFireDatabase) {}

  public getTeamFeeds(teamId, limitTo) {
    // return new Promise((resolve, reject) => {
    if (limitTo) {
      return this.fireDb.database
        .ref('/teams/' + teamId)
        .orderByChild('createdAt')
        .limitToLast(limitTo);
      // .on('value', (snap) => {
      //   resolve(snap.val());
      // });
    } else {
      return this.fireDb.database.ref('/teams/' + teamId);
      // .on('value', (snap) => {
      //   resolve(snap.val());
      // });
    }
    // });
  }

  public addLikeToTeamFeed(teamId, feedId, likesObject, likeDetails) {
    if (!likesObject) {
      return this.fireDb.database.ref('/teams/' + teamId + '/' + feedId).update(likeDetails);
    }
    return this.fireDb.database
      .ref('/teams/' + teamId + '/' + feedId)
      .child('likes')
      .set(likeDetails);
  }

  public addCommentToTeamFeed(teamId, feedId, index, commentDetails) {
    // if (!index) {
    //   console.log("1111");
    //   return this.fireDb.database
    //   .ref('/teams/' + teamId + '/' + feedId)
    //   .update(commentDetails)
    //   .then(() => true,
    //   (error) => error,
    //   );
    // }
    return this.fireDb.database
      .ref('/teams/' + teamId + '/' + feedId)
      .child('comments')
      .child(index)
      .set(commentDetails)
      .then(
        () => true,
        (error) => error,
      );
  }

  public addTeamFeed(teamId, feedDetails) {
    this.fireDb.database
      .ref('/teams/' + teamId)
      .push(feedDetails)
      .then((res) => res);
  }

  public removeLike(teamId, feedId, likesObject) {
    this.fireDb.database
      .ref('/teams/' + teamId + '/' + feedId)
      .child('likes')
      .set(likesObject)
      .then((res) => {
        return res;
      });
  }

  public commentCheck(teamId, commentCheck) {
    return this.fireDb.database.ref('/teams/' + teamId).update(commentCheck);
  }

  public loadMoreFeed(teamId, limitTo, lastId) {
    this.fireDb.database
      .ref('/teams/' + teamId)
      .orderByChild('createdAt')
      .limitToLast(limitTo)
      .startAt(lastId)
      .on('value', (snap) => {
        return snap.val();
      });
  }
}
