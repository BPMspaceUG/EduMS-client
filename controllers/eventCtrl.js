<script  type="text/javascript">
app.controller('eventCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getEvent')
	.then(function(response) {
		$scope.event = response.data;
		console.log('Event: '); console.log($scope.event);
	},function(response) {$scope.event = 'Fehler in eventCtrl-$http: '+response}
	)
}]);
</script>