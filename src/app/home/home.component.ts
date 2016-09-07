import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { AppState } from '../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

@Component({

  selector: 'home',
  providers: [

  ],
  styleUrls: [ './home.style.css' ],
  templateUrl: './home.template.html'
})
export class Home {
  localState = { value: '' };
  data = 'IniBuatKitaLoh';

  loading = false;
  log = false;
  nama;

  pilihan = 0;

  token;
  test = false;
  jwtHelper: JwtHelper = new JwtHelper();
  private login = {'username' : '', 'password': ''};

  constructor(public appState: AppState, public toastr: ToastsManager, public router: Router, private route: ActivatedRoute, private http: Http) {
  }


  ngOnInit() {
    // console.log('hello `Home` component');
    this.token = localStorage.getItem('id_token');

    if (this.token) {
      let decoded = this.jwtHelper.decodeToken(this.token);
      this.nama = decoded.nama;
    }

  }

  radio(num) {
    this.pilihan = num;
  }

  showSuccess() {
    this.toastr.success('Login Berhasil', 'Success!');
    // console.log(event);
  }

  showError(text) {
    this.toastr.error(text, 'Error!');
    // console.log(event);
  }

  submit() {
    this.loading = true;
    let creds = JSON.stringify({username: this.login.username, password: this.login.password, magic: this.data});

    this.http.post('http://test.agri.web.id/api/test1', creds)
      .map(res => res.json())
      .subscribe(data => {
        // let temp = data.json();
        // this.nama =

        if (data.status) {
          localStorage.setItem('id_token', data.token);
          let decoded = this.jwtHelper.decodeToken(data.token);
          this.nama = decoded.token;
          this.log = true;
          this.showSuccess();
          this.loading = false;
        }
        else {
          localStorage.clear();
          this.loading = false;
          this.showError(data.message);

        }

        console.log(data);

        // localStorage.setItem('data', JSON.stringify(this.dataLocal));


      // console.log
    })

  }

}
