import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

declare let Accept;

export interface ICardData {
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
  zip?: string;
  expiration: string;
}

export interface IOPaqueData {
  dataDescriptor: 'COMMON.ACCEPT.INAPP.PAYMENT';
  dataValue: string;
}

export interface IMessage {
  code: string;
  text: string;
}

interface ISecureData {
  cardData?: ICardData;
  authData?: IAuthData;
}

interface IAuthData {
  clientKey?: string;
  apiLoginID?: string;
}

@Injectable()
export class AuthorizeNetService {
  constructor() {}

  authorize(cardData: ICardData) {
    const exp = cardData.expiration.split('/');
    cardData.month = exp[0];
    cardData.year = exp[1];

    const secureData: ISecureData = {};
    const authData: IAuthData = {};

    // Extract the card number, expiration date, and card code.
    secureData.cardData = cardData;

    // The Authorize.Net Client Key is used in place of the traditional Transaction Key. The Transaction Key
    // is a shared secret and must never be exposed. The Client Key is a public key suitable for use where
    // someone outside the merchant might see it.
    authData.clientKey = environment.AUTHORIZE_NET.CLIENT_KEY;
    authData.apiLoginID = environment.AUTHORIZE_NET.API_LOGIN_ID;
    secureData.authData = authData;
    secureData.cardData.cardNumber = secureData.cardData.cardNumber.replace(/ /g, '');
    // Pass the card number and expiration date to Accept.js for submission to Authorize.Net.
    return new Promise((resolve, reject) => {
      Accept.dispatchData(secureData, (response) => {
        // Process the response from Authorize.Net to retrieve the two elements of the payment nonce.
        // If the data looks correct, record the OpaqueData to the console and call the transaction processing function.
        if (response.messages.resultCode === 'Error') {
          reject(response.messages.message);
          /*
                    for (var i = 0; i < response.messages.message.length; i++) {
                    }
                    */
        } else {
          resolve(response.opaqueData);
        }
      });
    });
  }
}
