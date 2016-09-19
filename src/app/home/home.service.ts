import { Injectable } from '@angular/core';

@Injectable()

export class HomeService {

  constructor() {

  }

  public bemKm = [
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
