import { DataLayerService } from '@core/utils';
import { Component, OnInit } from '@angular/core';
import { RagnarCMSDataService } from '@core/data';
@Component({
  selector: 'app-volunteer-contact',
  templateUrl: './volunteer-contact.component.html',
  styleUrls: ['./volunteer-contact.component.scss'],
})
export class VolunteerContactComponent implements OnInit {
  public raceName: Array<object> = [];
  public contact = {
    name: null,
    email: null,
    phone: null,
    race: null,
    team_number: null,
    where_did_you_hear: null,
    comments: null,
  };
  public show = {
    success: false,
    error: false,
    responseMsg: null,
  };
  public inputFocusCount = 0;
  constructor(private ragnarCmsDataService: RagnarCMSDataService, private dataLayerService: DataLayerService) {}

  ngOnInit(): void {
    this.getRaces();
  }

  getRaces() {
    this.ragnarCmsDataService.getRaces().subscribe((events) => {
      this.raceName = events.data.fetchRaceList;
    }, this.handleError);
  }
  /* TODO: API call */
  sendForm(form) {}

  private handleError(err) {
    console.error(err);
  }

  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'paymentRegisterForm',
        ...this.getDataLayerFormObj(form),
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'paymentRegisterForm',
      ...this.getDataLayerFormObj(form),
    });
  }
  getDataLayerFormObj(form) {
    const formFields = {};
    Object.keys(form.controls).forEach((key) => {
      formFields[key] = form.controls[key].value || '';
    });
    return formFields;
  }
}
