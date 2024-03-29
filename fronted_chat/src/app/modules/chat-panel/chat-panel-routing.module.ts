import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPanelBodyComponent } from './chat-panel-body/chat-panel-body.component';
import { ChatPanelProfileComponent } from './chat-panel-profile/chat-panel-profile.component';
import { ChatPanelComponent } from './chat-panel.component';

const routes: Routes = [
  {
    path: '',
    component: ChatPanelComponent,
    children:[
      {
        path: 'chat-content',
        component: ChatPanelBodyComponent,
      },
      {
        path: 'chat-profile',
        component: ChatPanelProfileComponent,
      },
      {
        path: '', redirectTo: 'chat-content', pathMatch: 'full',
      },
      {
        path: '**', redirectTo: 'chat-content', pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatPanelRoutingModule { }
