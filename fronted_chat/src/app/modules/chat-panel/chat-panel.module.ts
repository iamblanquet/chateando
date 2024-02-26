import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatPanelRoutingModule } from './chat-panel-routing.module';
import { ChatPanelComponent } from './chat-panel.component';
import { ChatPanelBodyComponent } from './chat-panel-body/chat-panel-body.component';
import { ChatPanelProfileComponent } from './chat-panel-profile/chat-panel-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatContentPanelComponent } from './chat-panel-body/cp/chat-content-panel/chat-content-panel.component';


@NgModule({
  declarations: [
    ChatPanelComponent,
    ChatPanelBodyComponent,
    ChatPanelProfileComponent,
    ChatContentPanelComponent,
  ],
  imports: [
    CommonModule,
    ChatPanelRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class ChatPanelModule { }
