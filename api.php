<?php
require_once 'config.php'; // DB-Verbindungsdaten aus externer Datei laden

// 0. Datenbankverbindung mit PDO herstellen
try {
  // Inside this try block, we attempt to create a new PDO object which represents the connection to the database.
  // We pass in the connection details such as host, database name, username, and password.
  $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
  
  // After creating the PDO object, we set an attribute to enable error handling. 
  // This line ensures that PDO will throw exceptions when it encounters errors instead of just issuing warnings or notices.
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  // If an exception (error) occurs during the connection attempt, this catch block will catch it.
  // We then print an error message along with the specific error message from the exception.
  die("ERROR: Could not connect. " . $e->getMessage());
}

  // 1. Abfrage aller Datensätze aus der Tabelle User


//save data from DB to variables
// $actual_wind_speed = $wind[0]["data_wind_speed"];
// $actual_wind_direction = $wind[0]["data_wind_direction"];
// $actual_air_temperature = $wind[0]["data_air_temperature"];
// $actual_maximum_wind_speed = $wind[0]["data_maximum_wind_speed"];
// $actual_measured_at = $wind[0]["measured_at"];

$sql = "SELECT * FROM Wind ORDER BY measured_at DESC LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$wind = $stmt->fetchAll(PDO::FETCH_ASSOC);
$jsonList = json_encode($wind);

//Datumsvariable umformen zu deutschem Format

setlocale(LC_ALL, 'de_CH'); // Setzen Sie die Lokalisierung auf Deutsch

// $new_date = strftime("%d. %B %Y".", "."%H:%M Uhr", strtotime($wind[0]["measured_at"]));
$new_date = date_format(date_create($wind[0]["measured_at"]), "d. F Y, H:i") . " Uhr";

$data = array(
  "actual_wind_speed" => $wind[0]["data_wind_speed"],
  "actual_wind_direction" => $wind[0]["data_wind_direction"],
  "actual_air_temperature" => $wind[0]["data_air_temperature"],
  "actual_maximum_wind_speed" => $wind[0]["data_maximum_wind_speed"],
  "actual_measured_at" => $new_date
);

// Set the appropriate headers to indicate JSON content
header('Content-Type: application/json');

// Output the data as JSON
echo json_encode($data);
