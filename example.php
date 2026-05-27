<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example</title>
</head>
<body>
<?php
    echo "Hello World!";
    echo "<script>console.log('Hello Console!');</script>";

    $rezultat="";
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $input = $_POST["numere"];
        $numere = explode(",", $input);

        $pare=0;
        $impare=0;

        for ($i=0; $i < count($numere); $i++){
            if($numere[$i] % 2 == 0){
                $pare++;
            } else {
                $impare++;
            }
        }

        $rezultat="Numere pare: " . $pare . " Numere impare: " . $impare;
    }
?>
<form method="POST">
    <input type="text" name="numere" placeholder="...">
    <button type="submit">Submit</button>
</form>
<p><?php echo $rezultat; ?></p>
</body>
</html>