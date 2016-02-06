<script  type="text/javascript">
app.controller('statusTrainerCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getStatusTrainer')
	.then(function(response) {
		$scope.statusTrainer = response.data;
		console.log('statusTrainers: '); console.log($scope.statusTrainer);
	},function(response) {$scope.statusTrainer = 'Fehler in statusTrainerCtrl-$http: '+response}
	)
}]);
</script>