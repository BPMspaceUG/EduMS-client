<script  type="text/javascript">
app.controller('brandLocationCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getBrandLocation')
	.then(function(response) {
		$scope.brandLocation = response.data;
		console.log('brandLocation: '); console.log($scope.brandLocation);
	},function(response) {$scope.brandLocation = 'Fehler in brandLocationCtrl-$http: '+response}
	)
}]);
</script>