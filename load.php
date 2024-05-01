<?php
require_once 'config.php';
echo "Hello Load!";

include 'transform.php';  

//connect to database through config.php


try {

    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    echo "Connected to the database successfully!";
  } catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

  //look if table "wind" exists
    $sql = "SHOW TABLES LIKE 'Wind'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchColumn();
    if ($result === false) {
        echo "Table 'Wind' does not exist. Creating table...";
        $sql = "CREATE TABLE Wind (
                id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                measured_at DATETIME NOT NULL,
                data_air_temperature FLOAT(10, 6) NOT NULL,
                data_maximum_wind_speed FLOAT(10, 6) NOT NULL,
                data_wind_direction FLOAT(10, 6) NOT NULL,
                data_wind_speed FLOAT(10, 6) NOT NULL
            )";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        echo "Table 'Wind' created successfully!";
    } else {
        echo "Table 'Wind' already exists!";
    }
    
    //insert data into table
    //get data from table, check if measured_at is already in the table, if not insert data


$sql = "SELECT * FROM Wind ORDER BY measured_at DESC LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$last_record = $stmt->fetch();//fetch last measured date and time from DB
// print_r("last_record: ".$last_record["measured_at"]); 
$stringToDate = strtotime($last_record["measured_at"]);
// echo "stringToDate: ".$stringToDate;
$output_date = date("Y-m-d\TH:i:sP", $stringToDate);
// echo "output_date: ".$output_date;

if ($output_date == $wind_data[0]["measured_at"]) {
    echo "it's the same";
} else if ($output_date != $wind_data[0]["measured_at"]){ 
    echo "it's different";
    $sql = "INSERT INTO Wind (measured_at, data_air_temperature, data_maximum_wind_speed, data_wind_direction, data_wind_speed) VALUES (:measured_at, :data_air_temperature, :data_maximum_wind_speed, :data_wind_direction, :data_wind_speed)";
    $stmt = $pdo->prepare($sql);
    foreach ($wind_data as $item) {
        $stmt->execute([
            'measured_at' => $item['measured_at'],
            'data_air_temperature' => $item['data_air_temperature'],
            'data_maximum_wind_speed' => $item['data_maximum_wind_speed'],
            'data_wind_direction' => $item['data_wind_direction'],
            'data_wind_speed' => $item['data_wind_speed']
        ]);
    }
    echo "Data inserted successfully!";
}

  
    ?>