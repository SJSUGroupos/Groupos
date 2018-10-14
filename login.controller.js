wliApp.controller('LoginCtrl',['$scope', '$rootScope','$location','$http','$localStorage','Flash','loginService',function($scope,$rootScope,$location,$http,$localStorage,Flash,loginService){
	$rootScope.loggedinuser = false;-

	//Function to authenticate
	$scope.checkdata = function(){
  	 	 var email = $scope.email;
  	 	 var password = $scope.password;

  	 	 //Call the login service
      	loginService.validateUser(email,password).success(function(response, status) {
          	//If user is valid user
	  	 	 if(response && response.cnt>=1)
	  	 	 {
	  	 	 	$localStorage.loggedin = true;
	  	 	 	$localStorage.token = response.token;
	 		    $rootScope.logcheck = true;
		        $rootScope.emp_name = response.name;
		        $rootScope.emp_code = response.code;
		        $localStorage.code = response.code;
	            $location.path('list');

			    // Displays success login message
	    	    var message = 'Login success';
	            Flash.create('success', message);
	  	 	 }

	  	 	 //If user is an invalid user
	  	 	 if(response && response==-1)
			 {
	        	 $rootScope.loggedinuser = false;
			 	 $rootScope.loginerror = true;
	        	 $rootScope.err = false;
	        	 $rootScope.logoutmsg=false;
	        	 var message = 'Invalid username or password';
	             Flash.create('danger', message);
			 }
        });
	};
}]);
