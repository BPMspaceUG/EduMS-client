<script  type="text/javascript">
app.controller('statusEventGuaranteeCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getStatusEventGuarantee')
	.then(function(response) {
		$scope.statusEventGuarantee = response.data;
		console.log('statusEventGuarantees: '); console.log($scope.statusEventGuarantee);
	},function(response) {$scope.statusEventGuarantee = 'Fehler in statusEventGuaranteeCtrl-$http: '+response}
	)
}]);
</script>