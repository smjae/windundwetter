<?php

echo "Hello World!";

// date_default_timezone_set('UTC');
// $today = date("Y-m-d\TH:i:s\+00:00");
// echo $today;

// $api_url = 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/windmessung-bahnhofplatz-stadt-stgallen/records'.$today;

$api_url = "https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/windmessung-bahnhofplatz-stadt-stgallen/records?select=measured_at%2C%20data_wind_speed%2C%20data_wind_direction%2C%20data_maximum_wind_speed%2C%20data_air_temperature&order_by=measured_at%20DESC&limit=1&offset=0&timezone=Europe%2FBerlin";

$ch = curl_init($api_url); //curl = client URL abfragen, ch = client/curl handle

// curl_setopt($ch, CURLOPT_URL, $api_url); //setzt eine Option für eine cURL-Übertragung

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //curl_setopt — Setzt eine Option für eine cURL-Übertragung

//output
$output = curl_exec($ch); //curl_exec — Führt die cURL-Übertragung aus


$data = json_decode($output, true);

$wind_data = [];
$wind_data = [];
foreach ($data['results'] as $record) {
    $wind_data[] = [
        'measured_at' => $record['measured_at'],
        'data_wind_speed' => $record['data_wind_speed'],
        'data_wind_direction' => $record['data_wind_direction'],
        'data_air_temperature' => $record['data_air_temperature'],
        'data_maximum_wind_speed' => $record['data_maximum_wind_speed']
    ];
}

// foreach ($wind_data as $wind) {
//     echo "Measured at: " . $wind['measured_at'] . ", ";
//     echo "Wind Speed: " . $wind['data_wind_speed'] . " m/s, ";
//     echo "Wind Direction: " . $wind['data_wind_direction'] . " degrees, ";
//     echo "Air Temperature: " . $wind['data_air_temperature'] . "°C, ";
//     echo "Maximum Wind Speed: " . $wind['data_maximum_wind_speed'] . " m/s<br>";
// }
    





?>