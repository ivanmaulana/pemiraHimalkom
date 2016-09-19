<?php

  // include
  include 'config.php';
  include 'headers.php';
  // include 'jwtConf.php';

  // // require JWT
  // require 'vendor/autoload.php';
  // use \Firebase\JWT\JWT;
  //
  //
  // // TOKEN PROVIDED
  // if ($token) {
  //
  //   try {
  //
  //     // key JWT
  //     $key = 'JanganBikinMasalahDong2';
  //     // decode token
  //     $decoded_raw = JWT::decode($token, $key, array('HS256'));
  //     $decoded = (array) $decoded_raw;
  //
  //     $postdata = file_get_contents("php://input");
  //
  //     // JSON Decode from input
  //     $request = json_decode($postdata);
  //     $user = $request->user;
  //     $vote = $request->vote;
  //
  //     // print_r( $headers);
  //     // echo $token;
  //
  //     // echo $user.' '.$vote;
  //     $query = mysqli_query($link, "INSERT INTO data (user, vote) VALUES ('$user', '$vote')");
  //
  //     if($query) {
  //       header('Content-type: application/json');
  //       echo json_encode(array(status => true, message => 'Anda Berhasil Memilih'));
  //     }
  //
  //   }
  //
  //   // TOKEN FAILED
  //   catch (Exception $e){
  //
  //     $arr = array(
  //       status => false,
  //       message => 'Token Authorization Failed'
  //     );
  //
  //     header('Content-type: application/json');
  //     header('HTTP/1.0 401 Unauthorized');
  //     echo json_encode($arr);
  //
  //   }
  //
  // }
  //
  // // NO TOKEN PROVIDED
  // else {
  //
  //   $arr = array(
  //     status => false,
  //     message => 'No token provided'
  //   );
  //
  //   header('Content-type: application/json');
  //   header('HTTP/1.0 401 Unauthorized');
  //   echo json_encode($arr);
  //
  // }

  $postdata = file_get_contents("php://input");

  // JSON Decode from input
  $request = json_decode($postdata);
  $user = $request->user;
  $vote = $request->vote;

  // print_r( $headers);
  // echo $token;

  // echo $user.' '.$vote;
  $query = mysqli_query($link, "INSERT INTO data (user, vote) VALUES ('$user', '$vote')");
  $query2 = mysqli_query($link, "UPDATE pemilih SET pilih = 1 WHERE nrp = '$user'");

  if($query && $query2) {
    header('Content-type: application/json');
    echo json_encode(array(status => true, message => 'Anda Berhasil Memilih'));
  }



 ?>
