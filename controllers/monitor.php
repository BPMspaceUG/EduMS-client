
<?php
$trainer = 'trainer';
?>

<script language="javascript" type="text/javascript">

var trainer = "<?php echo $trainer ?>";

var app = angular.module('application', []);
app.controller('monitorCtrl', ['$scope','$http', function ($scope, $http) {
	/*$http.get(/gettopic)*/
	topics=$http.get('DBManager.inc.php');
	//console.log(window.topics);
  $scope.topics = topics || [{topic:'SCRUM'},{topic:'ISO 27000'},{topic:'m'},{topic:'e'},{topic:'h'},{topic:'r'}];
  $scope.postdata = function(){
  	$http.post('index.php', $scope.imptext)
  	.success(console.log('postsuccess'))
  }
//console.log('$scope.topics'+JSON.stringify($scope.topics));
//console.log(trainer);
}]);
</script>