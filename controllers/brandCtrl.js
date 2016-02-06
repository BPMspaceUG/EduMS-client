<script  type="text/javascript">
app.controller('brandCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getBrand')
	.then(function(response) {
		$scope.brandNames = response.data;
		console.log('brandNames: '); console.log($scope.brandNames);
	},function(response) {$scope.brandNames = 'Fehler in brandCtrl-$http: '+response}
	)
}]);
</script>