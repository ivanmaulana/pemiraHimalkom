import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'login',
  styleUrls: [ './login.style.css' ],
  templateUrl: './login.template.html'
})

export class Login {
  localState;
  constructor() {

  }

  ngOnInit() {

    console.log('hello `Login` component');

  }

}
