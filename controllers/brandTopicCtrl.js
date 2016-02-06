<script  type="text/javascript">
app.controller('brandTopicCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getBrandTopic')
	.then(function(response) {
		$scope.brandTopic = response.data;
		console.log('brandTopic: '); console.log($scope.brandTopic);
	},function(response) {$scope.brandTopic = 'Fehler in brandTopicCtrl-$http: '+response}
	)
}]);
</script>