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
  bilikStatus = false;

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
  namaFmipa = '';


  token;
  test = false;
  jwtHelper: JwtHelper = new JwtHelper();
  private login = {'username' : '', 'password': ''};
  private bilik;

  qr = false;
  qrcode;

  constructor(public service: HomeService, public appState: AppState, public toastr: ToastsManager, public router: Router, private route: ActivatedRoute, private http: Http) {

    this.km = service.bemKm;
    this.fmipa = service.fmipa;

    setInterval(() => {
      this.bilik = localStorage.getItem('bilik');

      http.get('http://test.agri.web.id/api/bilik.php?bilik='+this.bilik)
          .map(res => res.json())
          .subscribe(data => {
            console.log(this.log+' '+data['statusBilik']);

            if (this.log && !this.qr && data['statusBilik'] === '0') {
              console.log('harusnya bisa');


              this.keluar();
              this.showGagalMilih('Force Log Out');
            }


        });

    }, 2000);

  }

  ngOnInit() {
    this.token = localStorage.getItem('id_token');

    if (this.token) {
      let decoded = this.jwtHelper.decodeToken(this.token);
      this.nama = decoded.nama;
      this.nim = decoded.nim;
      this.log = true;
      this.loading = false;
    }

    else {
      this.log = false;
    }

  }

  pilihBilik(pilih) {
    localStorage.setItem('bilik', pilih);
    this.bilik = pilih;
  }

  radioFmipa(num) {
    this.pilihanFmipa = num;
    if(num == 1) this.pilihFmipa1 = true;
    else if(num == 2) this.pilihFmipa2 = true;

    this.namaFmipa = this.km[num-1].ketua+' - '+this.km[num-1].wakil;
  }

  clear() {
    this.pilihKm1 = false;
    this.pilihKm2 = false;
    this.pilihFmipa1 = false;
    this.pilihFmipa2 = false;

    this.pilihanKm = 0;
    this.pilihanFmipa = 0;
    this.login.username = "";
    this.login.password = "";

    this.namaKm = '-';
    this.namaFmipa = '';
  }

  cekBilik() {

  }

  showSuccess() {
    this.toastr.success('Login Berhasil', 'Success!');
  }

  showError(text) {
    this.toastr.error(text, 'Error!');
  }

  reset() {
    this.login.username = '';
    this.login.password = '';
  }

  submit() {
    this.loading = true;
    let status = false;

    this.bilik = localStorage.getItem('bilik');
    let creds = JSON.stringify({username: this.login.username, password: this.login.password, magic: this.data, bilik: this.bilik});

    this.http.post('http://test.agri.web.id/api/testMipa', creds)
      .map(res => res.json())
      .subscribe(data => {
        if (data) status = true;
        if (data.status) {
          localStorage.setItem('id_token', data.token);
          let decoded = this.jwtHelper.decodeToken(data.token);
          this.nama = decoded.nama;
          this.nim = decoded.nim;
          this.log = true;
          this.showSuccess();
          this.loading = false;
        }
        else {
          localStorage.removeItem('id_token');
          this.loading = false;
          this.showError(data.message);

        }

    });

    setTimeout(() => {
      if (!status) {
        this.showNoConn();
        this.log = false;
        this.loading = false;
        localStorage.removeItem('id_token');
      }
    }, 5000)

  }

  showNoConn() {
    this.toastr.error('Connection Time Out', 'Error!');
  }

  vote() {
    if (!this.pilihanFmipa) {
      this.showGagalMilih('Silahkan Pilih Salah Satu');
    }
    else {
      this.token = localStorage.getItem('id_token');
      let decoded = this.jwtHelper.decodeToken(this.token);
      this.nama = decoded.nama;
      let headers = new Headers({ 'Content-Type': 'application/json' });
      headers.append('Authorization', this.token);
      let creds = JSON.stringify({vote : this.pilihanFmipa});

      this.http.post('http://test.agri.web.id/api/voteMipa', creds, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {

          if(data['status']) {
            this.showSuccessMilih();
            this.qrcode = data['data'];
            this.qr = true;

            setTimeout(() => {
              localStorage.removeItem('id_token');
              this.clear();
              this.log = false;
              this.qrcode = '';
              this.qr = false;
            }, 20000)
          }

          if(!data['status']) {
            this.showGagalMilih(data['message']);

            localStorage.removeItem('id_token');
            this.clear();
            this.log = false;

          }


        })
    }



  }

  keluar() {
    localStorage.removeItem('id_token');
    this.clear();
    this.log = false;
    this.qrcode = '';
    this.qr = false;
  }

  showSuccessMilih() {
    this.toastr.success('Anda Berhasil Memilih', 'Success!');
  }

  showGagalMilih(pesan) {
    this.toastr.error(pesan, 'Error!');
  }


}
