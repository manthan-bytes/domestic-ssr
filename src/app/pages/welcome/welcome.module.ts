import { WelcomeRoutingModule } from './welcome-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WelcomeComponent } from './welcome.component';
import { ComponentsModule } from '@components/components.module';

const COMPONENTS = [WelcomeComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, WelcomeRoutingModule, ComponentsModule],
  exports: [...COMPONENTS],
})
export class WelcomeModule {}
