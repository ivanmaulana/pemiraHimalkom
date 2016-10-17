import { Injectable } from '@angular/core';

@Injectable()

export class HomeService {

  constructor() {

  }

  public bemKm = [
    {
      'id' : 1,
      'ketua' : 'Sayyid Al Bahr Maulana',
      'wakil' : 'Riyan Hidayatullah'
    },
    {
      'id' : 2,
      'ketua' : 'Muhammad Fahreza',
      'wakil' : 'Nizar Maulana Azhari '
    },
  ]

  public fmipa = [
    {
      'id' : 1,
      'ketua' : 'Joko Widodo',
      'wakil' : 'Jusuf Kalla',
      'quote' : 'Indonesia Hebat'
    },
    {
      'id' : 2,
      'ketua' : 'Prabowo Subianto',
      'wakil' : 'Hatta Radjasa',
      'quote' : 'Selamatkan Indonesia'
    },
  ]


}
