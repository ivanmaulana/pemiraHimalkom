<?php

    require 'vendor/autoload.php';

    use \Firebase\JWT\JWT;

    // username check
    function search($ldap_con, $base_dn = false, $filter ='', $attr = array())
    {
            $result = ldap_search($ldap_con, $base_dn, $filter, $attr);
            return ldap_get_entries($ldap_con, $result);
    }

    // password check
    function check_password($ldap_con, $rdn, $password)
    {
            $bind = @ldap_bind($ldap_con, $rdn, $password);
            if($bind) return true;
            else return false;
    }

    // check HTTP Origin
	if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    // DB Connect
    $host = "172.17.1.6";
    $port = "389";
    $base_dn = "dc=ipb,dc=ac,dc=id";

    // // get JSON input from HTTP POST
    // $postdata = file_get_contents("php://input");
    //
    // // JSON Decode from input
    // $request = json_decode($postdata);
    // $username = $request->username;
    // $password = $request->password;
    // $magic = $request->magic;

    $username = $_POST['username'];
    $password = $_POST['password'];
    $magic = $_POST['magic'];

    $ldap_con = ldap_connect( $host, $port );

    $data = search($ldap_con, $base_dn, 'uid='.$username);

    // avoid print unless username & password is set
	    // avoid print unless username & password is set
    if ($password == "" || $username == "" || $magic == ""){
      header('Content-type: application/json');
      echo json_encode(array(status => false, message => "Data tidak lengkap"));
    }
    else {

      if ($magic == 'JanganDirusakDong') {

        if (isset($username) && isset($password) && $data['count']>0){

          $cek = check_password($ldap_con, $data[0]['dn'], $password);
          if ($cek == true){

            $dn = $data[0]['dn'];
            $nim = $data[0]['nrp'][0];
            $nip = $data[0]['nip'][0];
            $nama = $data[0]['cn'][0];

            $key = "JanganBikinMasalahDong";

            $payload = array(
              "iss" => "PEMIRA.IPB",
              "sub" => "ivanmaulana@apps.ipb.ac.id",
              "username" => $username,
              "nim" => $nim,
              "nama" => $nama
              // "iat" => time(),
              // "exp" => time() + 1800
            );

            $token = JWT::encode($payload, $key);
            $array = array(status => true, token => $token);

            header('Content-type: application/json');
            echo json_encode($array);

            mysqli_free_result($result);

          }

          else {
            header('Content-type: application/json');
            echo json_encode(array(status => false, message => "Username / password Salah"));
          }
        }

        else {
          header('Content-type: application/json');
          echo json_encode(array(status => false, message => "Username / password salah"));
        }

      }

      else {
        header('Content-type: application/json');
        echo json_encode(array(status => false, message => "Token salah"));
      }

    }

?>
