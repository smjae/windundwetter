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

/* //geht noch nicht!!!
// 2. Einfügen eines neuen Datensatzes
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST["firstname"];
    $lastname = $_POST["lastname"];
    $email = $_POST["email"];
    
    // Prepare the SQL statement
    $sql = "INSERT INTO User (firstname, lastname, email) VALUES (:firstname, :lastname, :email)";
    
    // Prepare the statement
    $stmt = $pdo->prepare($sql);
    
    // Bind the parameters
    $stmt->bindParam(":firstname", $firstname);
    $stmt->bindParam(":lastname", $lastname);
    $stmt->bindParam(":email", $email);
    
    // Execute the statement
    if ($stmt->execute()) {
      echo "New record created successfully";
    } else {
      echo "Error: " . $stmt->errorInfo()[2];
    }
  }
  
  
  // 3. Lesen eines Datensatzes mit id
  if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $id = $_GET["id"];
    
    // Prepare the SQL statement
    $sql = "SELECT * FROM User WHERE id = :id";
    
    // Prepare the statement
    $stmt = $pdo->prepare($sql);
    
    // Bind the parameters
    $stmt->bindParam(":id", $id);
    
    // Execute the statement
    if ($stmt->execute()) {
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      $json = json_encode($user);
    } else {
      echo "Error: " . $stmt->errorInfo()[2];
    }
  }
  
  // 4. Lesen aller Datensätze, die den String $string in firstname, lastname oder email enthalten
  if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $string = $_GET["string"];
    
    // Prepare the SQL statement
    $sql = "SELECT * FROM User WHERE firstname LIKE :string OR lastname LIKE :string OR email LIKE :string";
    
    // Prepare the statement
    $stmt = $pdo->prepare($sql);
    
    // Bind the parameters
    $stmt->bindParam(":string", $string);
    
    // Execute the statement
    if ($stmt->execute()) {
      $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $jsonList = json_encode($users);
    } else {
      echo "Error: " . $stmt->errorInfo()[2];
    }
  }

  // 1. Abfrage aller Datensätze aus der Tabelle User
$sql = "SELECT * FROM User";

*/?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>PHP mit HTML</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <h1><a href="crud_direkt.php">CRUD - PHP</a></h1>
  <p>geht noch nicht, da DB fehlt...</p>
</body>
</html>