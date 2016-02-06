<script  type="text/javascript">
app.controller('locationCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getLocation')
	.then(function(response) {
		$scope.location = response.data;
		console.log('locations: '); console.log($scope.location);
	},function(response) {$scope.location = 'Fehler in locationCtrl-$http: '+response}
	)
}]);
</script>