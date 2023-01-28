import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
//   The MessagesComponent should display all messages, including the message sent by the HeroService when it fetches heroes.

constructor(public messageService: MessageService) {}

  ngOnInit(): void {
  }

}
