<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");

$filename = $_GET["filename"];
$pathname = $_GET["pathname"];
// Takes raw data from the request
$json = file_get_contents('php://input');
$archiveDir = realpath(dirname(__FILE__)) . $pathname;
$filesDir = realpath(dirname(__FILE__))  . "/../../files";
$outZipPath = $archiveDir . "/" . $filename;
echo  PHP_EOL;
echo 'pathname: ' . $pathname . PHP_EOL;
echo 'filename: ' . $filename . PHP_EOL;

echo 'archiveDir: ' . $archiveDir . PHP_EOL;
echo 'filesDir: ' . $filesDir . PHP_EOL;
echo 'outZipPath: ' . $outZipPath . PHP_EOL;

// Converts it into a PHP object
$data = json_decode($json);

$z = new ZipArchive();
if(true === ($z->open($outZipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE))){
    foreach ($data as &$value) {
        echo 'outZipPath: ' . $value->filepath . PHP_EOL;
        echo 'outZipPath: ' . $value->zipname . PHP_EOL;

        $z->addFile($value->filepath, $value->zipname);
    }
    $z->addFromString('map.json', $json);
    $z->close();
    echo 'Success!';
    return;
}
echo 'Fail';