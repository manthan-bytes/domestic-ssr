import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataModule } from './data/data.module';
import { ThemeModule } from './theme/theme.module';
import {
  MetaTagsService,
  LocalStorageService,
  CountryService,
  MapBoxService,
  SessionStorageService,
  MobileDetectionService,
  XMomentService,
  CopyToClipboardService,
  DefaultPaceService,
} from './utils/index';
import {
  DateFormatPipe,
  ShortUserNamePipe,
  ObjectSearchPipe,
  SortByPipe,
  SanitizeHtmlPipe,
  MapCustomPipe,
  FilterMeetupCalendarPipe,
  RoadPartnerPipe,
  SanitizeUrlPipe,
  SanitizeSMSUrlPipe,
  TimeFormatPipe,
  DateRangeFormatPipe,
  PaceFilterPipe,
  PhoneFilterPipe,
  ArrayFilterPipe,
  ParseImageUrlPipe,
  CurrencyFormatPipe,
  CalculateRemainingDaysPipe,
  ProfileNamePipe,
  FileNameAndTypePipe,
} from './pipes/index';

import {
  AutoSlashCCDateDirective,
  BirthdateDirective,
  PhoneDirective,
  RegisterButtonDirective,
  ScrollIntoViewDirective,
  LinkEventDetailDirective,
  NextStreakDirective,
} from './directives';
import { UtilsService } from './utils/utils.service';

import { VideoModalComponent } from './modal/index';
import { TinySliderService } from './utils/tiny-slider.service';
import { FirebaseService } from './firebase/index';
const PIPES = [
  DateFormatPipe,
  ShortUserNamePipe,
  ObjectSearchPipe,
  SortByPipe,
  SanitizeHtmlPipe,
  MapCustomPipe,
  FilterMeetupCalendarPipe,
  RoadPartnerPipe,
  SanitizeUrlPipe,
  SanitizeSMSUrlPipe,
  TimeFormatPipe,
  DateRangeFormatPipe,
  PaceFilterPipe,
  PhoneFilterPipe,
  ArrayFilterPipe,
  ParseImageUrlPipe,
  CurrencyFormatPipe,
  CalculateRemainingDaysPipe,
  ProfileNamePipe,
  FileNameAndTypePipe,
];

const UTIL_SERVICES = [
  MetaTagsService,
  // VirtualChallengeSharedDataService,
  LocalStorageService,
  CountryService,
  TinySliderService,
  SessionStorageService,
  MapBoxService,
  MobileDetectionService,
  UtilsService,
  XMomentService,
  CopyToClipboardService,
  DefaultPaceService,
  FirebaseService,
];

const DIRECTIVES = [
  AutoSlashCCDateDirective,
  BirthdateDirective,
  PhoneDirective,
  RegisterButtonDirective,
  ScrollIntoViewDirective,
  LinkEventDetailDirective,
  NextStreakDirective,
];

const COMPONENTS = [VideoModalComponent];

@NgModule({
  imports: [CommonModule, DataModule, ThemeModule],
  exports: [...PIPES, ...DIRECTIVES],
  declarations: [...PIPES, ...DIRECTIVES, ...COMPONENTS],
  providers: [...UTIL_SERVICES],
})
export class CoreModule {}
