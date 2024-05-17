<?php
require_once 'config.php'; // Load database connection details from external file

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Set locale to German
    setlocale(LC_TIME, 'de_DE.UTF-8');

    // Create an IntlDateFormatter for German locale
    $fmt = new IntlDateFormatter('de_DE', IntlDateFormatter::LONG, IntlDateFormatter::NONE, 'Europe/Berlin', IntlDateFormatter::GREGORIAN, 'd. MMMM yyyy');

    $dailyAverages = array();

    $twoWeeksAgo = strtotime('-2 weeks');
    $currentDay = time();
    $dayInSeconds = 86400; // Seconds in a day

    for ($timestamp = $twoWeeksAgo; $timestamp < $currentDay; $timestamp += $dayInSeconds) {
        $dayStart = date('Y-m-d 00:00:00', $timestamp);
        $dayEnd = date('Y-m-d 23:59:59', $timestamp);

        $sql = "SELECT 
            DATE_FORMAT(days.day_start, '%Y-%m-%d') AS day_start,
            AVG(wind.data_air_temperature) AS avg_air_temperature,
            AVG(CASE WHEN HOUR(wind.measured_at) BETWEEN 7 AND 20 THEN wind.data_air_temperature ELSE NULL END) AS avg_finer_air_temperature_day,
            AVG(CASE WHEN HOUR(wind.measured_at) NOT BETWEEN 7 AND 20 THEN wind.data_air_temperature ELSE NULL END) AS avg_finer_air_temperature_night
        FROM 
            (
                SELECT 
                    TIMESTAMP(DATE_FORMAT(:dayStart, '%Y-%m-%d 00:00:00') + INTERVAL (t3*1000 + t2*100 + t1*10 + t0) DAY) AS day_start
                FROM
                    (SELECT 0 t0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T0,
                    (SELECT 0 t1 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T1,
                    (SELECT 0 t2 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T2,
                    (SELECT 0 t3 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) T3
            ) AS days
            LEFT JOIN Wind AS wind ON DATE_FORMAT(wind.measured_at, '%Y-%m-%d') = days.day_start
        WHERE
            days.day_start >= :dayStart 
            AND days.day_start <= :dayEnd
        GROUP BY 
            days.day_start";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':dayStart', $dayStart, PDO::PARAM_STR);
        $stmt->bindParam(':dayEnd', $dayEnd, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // Format date using IntlDateFormatter
            $result['day_start'] = $fmt->format(new DateTime($result['day_start']));
            $dailyAverages[] = $result;
        }

        $stmt->closeCursor();
    }

    header('Content-Type: application/json');
    echo json_encode($dailyAverages);

} catch (PDOException $e) {
    echo "An error occurred while fetching the data: " . $e->getMessage();
    exit();
}