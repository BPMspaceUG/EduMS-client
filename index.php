<?php
/**
 * Created by PhpStorm.
 * User: cwalonka
 * Date: 03.10.15
 * Time: 18:03
 */
require_once 'config.inc.php';

$baseURL = "";//Pfad zum Script mit / am Ende
$css = file_get_contents($config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/css');
$response = '';
$contentid = '';
$footer = '';

if(array_key_exists('contentid',$_GET)){
    intval($_GET['contentid'])>0 ? $contentid="/".intval($_GET['contentid']) : $contentid="";
}

$navigationDestiny = '';
if(array_key_exists('navdest',$_GET)){
    $navigationDestiny = $_GET['navdest'];
}

$responseurl = "";
switch ($navigationDestiny){
    // $config['srv']['addr'] = 'http://localhost:4040/EduMS/api/index.php';
    case 'packages':
        $responseurl = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/package'.$contentid;
        break;
    case 'locations':
        $responseurl = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/location'.$contentid;
        break;
    case 'topics':
        $responseurl = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/topics'.$contentid;
        break;
    case 'signup':
        $responseurl = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/signup';
        break;
    case 'boot':
        $responseurl = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/boot';
        break;
    case 'monitor':
        $responseurl = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/monitor';
        break;
    default:
        $responseurl = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'].'/';
}

$response = file_get_contents($responseurl);


if(isset($_REQUEST['debug']) && $_REQUEST['debug']==18234){
    echo "<hr>".($responseurl)."<hr>";
    var_dump(is_array(json_decode($response, true)));
    echo "<hr>";
    var_dump(json_decode($response, true));
    echo "<hr>";
}
if(!is_array(json_decode($response, true))){
    echo "Invalid response from Server - could not parse data";
    echo "<h2>Data is:</h2>";
    echo json_decode($response);
    echo "<h3>RAW:</h3>";
    echo $response;
    exit;
}






switch ($navigationDestiny){

    case 'boot':
    $content = $navigationDestiny . '|'; 
    $content .= file_get_contents('boot.html');
    break;

    case 'monitor':
        //$topnav = ;
        $sidebar = 'sidebar';
        $content = file_get_contents('controllers/monitor.php');   
        $content .= '<div ng-controller="monitorCtrl">';   
        $content .= file_get_contents('viewressources/inputFieldAndButton.html');   
        $content .= $response.'</div>';   
        $footer = 'footer';
    break;

    case 'topics':
        $response = json_decode($response, true);
        $content = '';
        foreach ($response['topiclist'] as $key){
            $name = $key['topic_name'];
            $description = $key['topic_description'];
            $id = $key['topic_id'];
            if ($contentid==''){
                $content .= <<<EOT
            <p><a href="?navdest=topics&contentid=$id">$name </a></p>
EOT;
            }
            else{
                $footer = $key['footer'];
                $content .= <<<EOT
            <p>$name<br>
            $description</p>
EOT;
            }
        }
        break;

    case 'locations':
        $response = json_decode($response, true);
        $content = '';
        if(count($response['locations'])==0){
            echo "error - no locations available";
            exit;
        }
        foreach ($response['locations'] as $key){
            $name = $key['location_name'];
            $description = $key['location_description'];
            $id = $key['location_id'];
            if ($contentid==''){
                $content .= <<<EOT
            <p><a href="?navdest=locations&contentid=$id">$name </a></p>
EOT;
            }
            else{
                $content .= <<<EOT
            <p>$name<br>
            $description</p>
EOT;
            }

        }
        break;

    case 'packages':
        $response = json_decode($response, true);
        $content = '';
        if(count($response['packagelist'])==0){
            echo "Keine Daten empfangen";
            exit;
        }
        $listedTopics = array();
        foreach ($response['packagelist'] as $key){
            $name = $key['topic_name'];
            $topicId = $key["topic_id"];
            $description = $key['topic_description'];
            if($contentid==''){
                if(!in_array($topicId,$listedTopics)){
                    array_push($listedTopics,$topicId);
                    $content .= <<<EOT
            <p><a href="?navdest=packages&contentid=$topicId">$name </a></p>
EOT;
                }
            }
            else{
                $packageId = $key['package_id'];
                $packageName = $key['package_name'];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                $packagePrice = $key['package_price'];
                $packageDiscount = $key['package_discount'];
                $packageDescription = $key['package_description'];



                $content .= <<<EOT
            <p>$packageName<br>
            $packagePrice<br>
            $packageDiscount<br>
            $packageDescription</p>
            <hr>
EOT;
            }
        }

        break;




    default:
    $response = json_decode($response, true);
    ob_start();
    var_dump($response);
    $content = ob_get_clean();
}


//var_dump($response);
if(array_key_exists('content',$response)){
    $content = "";
    foreach($response['content'] as $key){
        $content .= $key['text'];
    }
}

function getTopNav($response,$baseURL=""){
    if(!array_key_exists('topnav',$response)){
        return '';
    }
    $topnav = $response['topnav'];
    $result = "";
    if(sizeof($topnav)==0){
        return $result;
    }
    foreach($topnav as $key){
        $result .= "<a href=".$baseURL.$key['path'].">".$key['text']."</a>&nbsp;";
    }
    return $result;
}

function getSidebar($response,$baseURL=""){
    $result = "";
    if(array_key_exists('sidebar',$response)){
        foreach($response['sidebar'] as $key){
            $result .= $key['text'];
        }
    }
    if(array_key_exists('nextEvents',$response)){
        if(array_key_exists('sidebar',$response)){
            $result .= "<hr>";
        }
        for($i=0;$i<sizeof($response['nextEvents']);$i++){
            $result.= parseEvent($response['nextEvents'][$i]);
        }
    }
    return $result;
}

function parseEvent($eventdata){
    $name = $eventdata['course_name'];
    $start = $eventdata['start_date'];
    $end = $eventdata['finish_date'];
    $location = $eventdata['location_name'];

    $content = <<<EOT
$name<br>
$start bis $end<br>
$location
<hr>
EOT;
    return $content;
}

function getFooter($response,$baseURL){
    $result = "";
    if(array_key_exists('footer',$response)){
        foreach($response['footer'] as $key){
            $result .= $key['text'];
        }
    }
    return $result;
}
$topnav = getTopNav($response,$baseURL);
$sidebar = getSidebar($response,$baseURL);
$footer = $footer==''?getFooter($response,$baseURL):$footer;

echo <<<EOF
<!DOCTYPE html>
<html lang="de" ng-app='application'>
<head>
<script type="text/javascript"  src="https://code.jquery.com/jquery-2.2.0.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
<script src="https://code.angularjs.org/1.4.9/angular.js"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style type="text/css">
        <!--
        $css
        -->
    </style>


<style type="text/css">
.well_darkgrey {
    opacity: 0.9; /* opacity [0-1] */
    -moz-opacity: 0.9; /* opacity [0-1] */
    -webkit-opacity: 0.9; /* opacity [0-1] */
    background: #989898;
}

.90_percent {
    max-width: 90%;
}

.modal {
    position: fixed;
    top: 3%;
    right: auto;
    bottom: 0;
    left: 5%;
    overflow: hidden;
}

.modal-dialog {
    display: inline-block;
    position: fixed;
    margin: 0;
    width: 90%;
    height: 90%;
    padding: 0;
}

.modal-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 0;
    box-shadow: none;
}

.modal-header {
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 50px;
    padding: 10px;
    border: 0;
}

.modal-title {
    font-size: 2em;
    line-height: 30px;
}

.modal-body {
    position: absolute;
    top: 50px;
    bottom: 60px;
    width: 90%;
    overflow: auto;
}

.modal-footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 60px;
    padding: 10px;
}

table {
    margin-left: auto;
    margin-right: auto;
}

.btn-sucsess-outline {
    background: #FFFFFF;
    border-color: #5CB85C;
    border-style: solid;
    border-width: 2px;
}

body {
    position: relative;
}
</style>
</head>
<body>
    <div id="kopfbereich">
        $topnav
    </div>

    <div id="steuerung">
        $sidebar
    </div>

    <div id="inhalt">
        $content
    </div>

    <div id="fussbereich">
        $footer
    </div>
</div>
<span class="label label-success">Success</span>
<span class="label label-info">Info</span>
<span class="label label-warning">Warning</span>

</body>
</html>
EOF;



?>