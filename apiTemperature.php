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

    // Fetch distinct dates from the Wind table within the last two weeks
    $sql = "SELECT DISTINCT DATE(DATE_FORMAT(measured_at, '%Y-%m-%d')) AS day_start
            FROM Wind
            WHERE measured_at >= DATE_SUB(CURDATE(), INTERVAL 2 WEEK)";
    $stmt = $pdo->query($sql);
    $datesWithData = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

    foreach ($datesWithData as $date) {
        $dayStart = $date . ' 00:00:00';
        $dayEnd = $date . ' 23:59:59';

        

        $sql = "SELECT 
            DATE_FORMAT(:dayStart, '%Y-%m-%d') AS day_start,
            AVG(wind.data_air_temperature) AS avg_air_temperature,
            AVG(CASE WHEN HOUR(wind.measured_at) BETWEEN 7 AND 20 THEN wind.data_air_temperature ELSE NULL END) AS avg_finer_air_temperature_day,
            AVG(CASE WHEN HOUR(wind.measured_at) NOT BETWEEN 7 AND 20 THEN wind.data_air_temperature ELSE NULL END) AS avg_finer_air_temperature_night
        FROM Wind AS wind
        WHERE wind.measured_at >= :dayStart 
          AND wind.measured_at <= :dayEnd";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':dayStart', $dayStart, PDO::PARAM_STR);
        $stmt->bindParam(':dayEnd', $dayEnd, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

       

        if ($result && $result['avg_air_temperature'] !== null) {
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
