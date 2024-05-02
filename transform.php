<?php

echo "Hello Transform!";

include 'extract.php';


print_r($wind_data);

//round temperature to 1 decimal
$actual_air_temperature = round($wind_data[0]["data_air_temperature"], 1);