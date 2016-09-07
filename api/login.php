<?php

  require 'vendor/autoload.php';
  use \Firebase\JWT\JWT;

  include 'config.php';
  include 'headers.php';

  // echo 'HELLO WORLD!!';

  // get JSON input from HTTP POST
  $postdata = file_get_contents("php://input");

  if ($postdata) {

    // JSON Decode from input
    $request = json_decode($postdata);
    $username = $request->username;
    $password = $request->password;
    $magic = $request->magic;

    // echo $username.' '.$password.' '.$magic;

    // CEK INPUT
    if (isset($username) && isset($password) && isset($magic)) {

      // CEK MAGIC
      if ($magic == 'IniBuatKitaLoh') {

        // URL LOGIN
        $url = 'http://sbrc.ipb.ac.id/api/pemira.php';
        $data = array('username' => $username, 'password' => $password, 'magic' => 'JanganDirusakDong');

        // use key 'http' even if you send the request to https://...
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data)
            )
        );
        $context  = stream_context_create($options);
        $result =  file_get_contents($url, false, $context);

        // echo $result;
        $decoded = json_decode($result);
        $status = $decoded->status;
        $message = $decoded->message;
        $token = $decoded->token;

        // echo $token;

        // IF LOGIN FALSE
        if ($status == false) {
          header('Content-type: application/json');
          echo json_encode(array(status => false, message => $message));

        }

        // IF LOGIN TRUE
        else {

          $key = 'JanganBikinMasalahDong';
          // decode token
          $decoded_raw = JWT::decode($token, $key, array('HS256'));
          $decoded_jwt = (array) $decoded_raw;

          $nama = $decoded_jwt['nama'];
          $nim = $decoded_jwt['nim'];

          // echo $nama.' '.$nim;

          // QUERY NIM
          $query = "SELECT * FROM pemilih WHERE nim = '$nim'";
          $queryNim = mysqli_query($link, $query);

          $row = mysqli_fetch_array($queryNim);

          $statusAktif = $row['status'];
          $statusPilih = $row['pilih'];

          $count = mysqli_num_rows($queryNim);


          // CEK ADA ROW
          if ($count) {

            // AKTIF
            if ($statusAktif) {
              // echo 'aktif';


              // CEK BELUM PILIH
              if (!$statusPilih) {

                $key = "JanganBikinMasalahDong2";
                $time = time();

                $payload = array(
                  "iss" => "PEMIRA.IPB",
                  "sub" => "ivanmaulana@apps.ipb.ac.id",
                  "username" => $username,
                  "nim" => $nim,
                  "nama" => $nama,
                  "aktif" => $statusAktif,
                  "pilih" => $statusPilih,
                  "iat" => $time,
                  "exp" => $time + 1800
                );

                $tokenResult = JWT::encode($payload, $key);
                $array = array(status => true, token => $tokenResult);

                header('Content-type: application/json');
                echo json_encode($array);

              }

              // CEK SUDAH PILIH
              else {

                header('Content-type: application/json');
                echo json_encode(array(status => false, message => 'Kamu Sudah Memilih'));

              }


            }


            // BELUM DIAKTIFKAN
            else if (!$statusAktif) {

              header('Content-type: application/json');
              echo json_encode(array(status => false, message => 'Akun Kamu Belum Diaktifkan'));

            }

          }

          // CEK TIDAK TERDAFTAR
          else {

            header('Content-type: application/json');
            echo json_encode(array(status => false, message => 'Kamu Tidak Termasuk Daftar Pemilih'));

          }


        }


      }

      // MAGIC WRONG
      else {

        header('Content-type: application/json');
        echo json_encode(array(status => false, message => "Token Salah"));

      }

    }

    // INPUT NOT FULL
    else {

      header('Content-type: application/json');
      echo json_encode(array(status => false, message => "Data Tidak Lengkap"));
    }

  }

 ?>
