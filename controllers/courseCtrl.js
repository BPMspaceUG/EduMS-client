<script  type="text/javascript">
app.controller('courseCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getCourses')
	.then(function(response) {
		$scope.courses = response.data.courselist;
		console.log('getCourses: '); console.log($scope.courses);
	},function(response) {$scope.courses = 'Fehler in courseCtrl-$http: '+response}
	)
}]);
</script>