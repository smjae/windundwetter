<?php

echo "Hello Transform!";

include 'extract.php';


print_r($wind_data);
$wind_direction_clean = $wind_data[0]["data_wind_direction"];
$wind_speed_clean = $wind_data[0]["data_wind_speed"];

$vector = cos($wind_direction_clean*$wind_speed_clean);
print_r($vector);