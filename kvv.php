<?php
$curl = curl_init();
$data = filter_input(INPUT_GET, "stop") ? filter_input(INPUT_GET, "stop") : "de:8212:525";
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_URL, "https://live.kvv.de/webapp/departures/bystop/" . $data . "?key=377d840e54b59adbe53608ba1aad70e8");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
echo $result;
curl_close($curl);
?>
