import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { AppState } from '../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { HomeService } from './home.service';

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
  nim;

  pilihanKm = 0;

  pilihanFmipa = 0;

  km;
  fmipa;

  pilihKm1 = false;
  pilihKm2 = false;

  pilihFmipa1 = false;
  pilihFmipa2 = false;

  // PILIHAN
  namaKm = '-';
  namaFmipa = '-';


  token;
  test = false;
  jwtHelper: JwtHelper = new JwtHelper();
  private login = {'username' : '', 'password': ''};

  constructor(public service: HomeService, public appState: AppState, public toastr: ToastsManager, public router: Router, private route: ActivatedRoute, private http: Http) {

    // console.log(service.bemKm);

    this.km = service.bemKm;
    this.fmipa = service.fmipa;

  }


  ngOnInit() {
    this.token = localStorage.getItem('id_token');

    if (this.token) {
      let decoded = this.jwtHelper.decodeToken(this.token);
      this.nama = decoded.nama;
      this.nim = decoded.nim;
      this.log = true;
      // this.showSuccess();
      this.loading = false;
    }

    else {
      this.log = false;
    }

  }

  radioKm(num) {
    this.pilihanKm = num;
    if (num == 1) {
      this.pilihKm1 = true;


    }
    else if (num == 2) {
      this.pilihKm2 = true;

    }

    this.namaKm = this.km[num-1].ketua+' - '+this.km[num-1].wakil;
    // console.log(this.namaKm);
    // this.namaKm = this.service.bemKm[num-1].nama;
  }

  radioFmipa(num) {
    this.pilihanFmipa = num;
    if(num == 1) this.pilihFmipa1 = true;
    else if(num == 2) this.pilihFmipa2 = true;

    this.namaFmipa = this.fmipa[num-1].ketua+' - '+this.fmipa[num-1].wakil;
    // console.log(this.namaFmipa);
  }

  clear() {
    this.pilihKm1 = false;
    this.pilihKm2 = false;
    this.pilihFmipa1 = false;
    this.pilihFmipa2 = false;

    this.pilihanKm = 0;
    this.pilihanFmipa = 0;

    this.namaKm = '-';
    this.namaFmipa = '-';
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

        if (data.status) {
          localStorage.setItem('id_token', data.token);
          let decoded = this.jwtHelper.decodeToken(data.token);
          this.nama = decoded.token;
          this.nim = decoded.nim;
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
    })

  }

  vote() {
    // console.log(this.token);
    let header = new Headers();
    header.append('Authorization', this.token);
    let creds = JSON.stringify({user : this.nim, vote : this.pilihanFmipa});

    this.http.post('http://test.agri.web.id/api/vote', creds, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        console.log(data['status']);

        if(data['status']) {
          this.showSuccessMilih();

          localStorage.clear();
          this.log = false;
        }


      })

    console.log(creds);
  }

  showSuccessMilih() {
    this.toastr.success('Anda Berhasil Memilih', 'Success!');
    // console.log(event);
  }


}
