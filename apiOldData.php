<?php
require_once 'config.php'; // DB-Verbindungsdaten aus externer Datei laden

try {
  $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $hourlyAverages = array();

    $twoWeeksAgo = strtotime('-2 days');
    $currentHour = time();
    $hourInSeconds = 3600;

    for ($timestamp = $twoWeeksAgo; $timestamp < $currentHour; $timestamp += $hourInSeconds) {
        $hourStart = date('Y-m-d H:00:00', $timestamp);
        $hourEnd = date('Y-m-d H:59:59', $timestamp);

        // $sql = "SELECT 
        //             DATE_FORMAT(measured_at, '%Y-%m-%d %H:00:00') AS hour_start,
        //             AVG(data_wind_speed) AS avg_wind_speed,
        //             AVG(data_wind_direction) AS avg_wind_direction,
        //             AVG(data_air_temperature) AS avg_air_temperature,
        //             AVG(data_maximum_wind_speed) AS avg_maximum_wind_speed
        //         FROM 
        //             Wind 
        //         WHERE
        //             measured_at >= :hourStart
        //             AND measured_at <= :hourEnd
        //             AND measured_at IS NOT NULL
        //         GROUP BY 
        //             hour_start";

        $sql = "SELECT 
            DATE_FORMAT(hours.hour_start, '%Y-%m-%d %H:00:00') AS hour_start,
            AVG(wind.data_wind_speed) AS avg_wind_speed,
            AVG(wind.data_wind_direction) AS avg_wind_direction,
            AVG(wind.data_air_temperature) AS avg_air_temperature,
            AVG(wind.data_maximum_wind_speed) AS avg_maximum_wind_speed
        FROM 
            (
                SELECT 
                    TIMESTAMP(DATE_FORMAT(:hourStart, '%Y-%m-%d %H:00:00') + INTERVAL (t4*10000 + t3*1000 + t2*100 + t1*10 + t0) HOUR) AS hour_start
                FROM
                    (SELECT 0 t0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T0,
                    (SELECT 0 t1 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T1,
                    (SELECT 0 t2 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T2,
                    (SELECT 0 t3 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T3,
                    (SELECT 0 t4 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) T4
            ) AS hours
            LEFT JOIN Wind AS wind ON DATE_FORMAT(wind.measured_at, '%Y-%m-%d %H:00:00') = hours.hour_start
        WHERE
            hours.hour_start >= :hourStart 
            AND hours.hour_start <= :hourEnd
        GROUP BY 
            hours.hour_start";

        


        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':hourStart', $hourStart, PDO::PARAM_STR);
        $stmt->bindParam(':hourEnd', $hourEnd, PDO::PARAM_STR);
        $stmt->execute();
        $hourlyAverages[] = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt->closeCursor();

    }



    header('Content-Type: application/json');
    echo json_encode($hourlyAverages);


  } catch (PDOException $e) {
    // Fehlermeldung als reiner Text ausgeben
    echo "Beim Abrufen der Daten ist ein Fehler aufgetreten: " . $e->getMessage();
    exit(); // Beenden Sie die Ausführung des Skripts nach Anzeige des Fehlers
}

