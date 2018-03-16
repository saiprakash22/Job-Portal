var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'loginController'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'registerController'
        })
        .when('/jobpost', {
            templateUrl: 'views/jobpost.html',
            controller: 'jobController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/searchjob', {
            templateUrl: 'views/searchjob.html',
            controller: 'searchjobsController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/logout', {
            templateUrl: 'views/logout.html',
            controller: 'logoutController'
        })
        .when('/jobdisp', {
            templateUrl: 'views/jobdisp.html',
            controller: 'jobdispController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/jobs/:uid', {
            templateUrl: 'views/jobs.html',
            controller: 'jobsController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })

});

app.factory('authService', function ($http, $location, $rootScope) {
    return {
        isLoggedIn: function () {
            $http.get('/LoggedIn').then(function (data) {
                if (data.data.length) {
                    $rootScope.usertype = data.data[0].usertype;
                    // console.log(data.data[0].usertype);
                    return true;
                } else {
                    console.log('inside if condition');
                    $location.path('/');
                    return false;
                }
            });

        }
    }

});

app.controller('loginController', ['$scope','$route', '$rootScope', 'authService', '$http', '$location', function ($scope,$route, $rootScope, authService, $http, $location) {

    $scope.loginFn = function (user) {
        console.log('post function');
        $http.post('/login', user).then(function (data) {
            // console.log(data.data.data.usertype);
            console.log(data);
            if (data.data.flg == true) {
                console.log('inside flag');
                $rootScope.usertype =data.data.data.usertype;
                // $scope.usertype = data.data.data.usertype;
                console.log(data.data.data.usertype);
                if (data.data.data.usertype == "Employer") {
                    console.log('userlogin');
                    $location.path('/jobpost');
                   
                } else {
                    $location.path('/searchjob');
                    
                }
            }
        
            else {
                console.log('inside flag'+data.data.flg)
                console.log('invalid user');
                alert('Please enter the valid username and password');
                $route.reload();
            }
        })
       
    }
}]);

app.controller('registerController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.signupFn = function (user) {
        user.usertype = $scope.userType;
        $http.post('/register', user).then(function (data) {
            if (data.data.flg == true) {
                $location.path('/');
            }
        })
    }

}]);

app.controller('jobController', ['$scope','$rootScope','$http', '$location', function ($scope,$rootScope, $http, $location) {
    if($rootScope.usertype == 'Employer'){
    console.log('inside job post controller');
    
    $scope.jobPostFn = function (job) {
        $scope.job = job;
    // $scope.job.keywords = $scope.job.keywords.split(',');
        console.log('jobpostfn clicked!!')
        $http.post('/jobpost', $scope.job).then(function (data) {
            console.log('job click');
            if (data.data.flg == true) {
                alert('job posted successfully!!');
                $location.path('/jobdisp');
            }

        })
    }
}else{
    $location.path('/logout');
}
}]);

app.controller('logoutController', ['$scope','$rootScope', '$http', '$location', function ($scope,$rootScope, $http, $location) {

    $http.post('/logout').then(function (data) {
        
        console.log('inside logout!!');
        console.log(data);
        if (data.data.flg) {
            $rootScope.usertype = null;
            $location.path('/');
        } 

    })
}]);

app.controller('jobdispController', ['$scope', '$http', function ($scope, $http) {
    $http.get('/jobDisplay').then(function (data) {
        $scope.jobInfo = data.data;
    })

}]);


app.controller('searchjobsController', ['$scope','$route','$rootScope', '$routeParams', '$http', '$location', function ($scope,$route,$rootScope, $routeParams, $http, $location) {
    // console.log($rootScope.usertype);
  if($rootScope.usertype == 'JobSeeker'){
    $scope.arr = [];
    console.log('inside search job controller');
    $scope.searchFn = function(job){
        // $scope.job = job;
        $scope.job = job;
        // $scope.key = $scope.job.keywords.split(',');
        // $scope.job.keywords = $scope.key;
        // console.log($scope.key);
        // console.log($scope.job.keywords);
        $http.post('/searchjob',$scope.job).then(function(data){
            console.log(data);
            
                if(data.data.flg == true){
                    console.log(data.data.searchResult);
                    $scope.searchResult = data.data.searchResult;
                  
    
                } 
        })

        // console.log($scope.job.job_title);
        // $http.get('/jobDisplay').then(function (data) {
        //     $scope.jobDetails = data.data;
            
        //   for(var i=0;i<$scope.jobDetails.length; i++){
        //       if($scope.job.job_title == $scope.jobDetails[i].job_title || $scope.job.job_description == $scope.jobDetails[i].job_description || $scope.job.job_location == $scope.jobDetails[i].job_location){
        //           console.log('inside if');
        //           $scope.arr.push($scope.jobDetails[i]);
        //             console.log($scope.arr);
        //           $scope.searchResult = $scope.arr;
        //           break;
        //       }else{
        //           alert('search not found!!');
        //           break;
        //       }
        //   }
        //     console.log($scope.jobDetails);
        // });
    }

    $scope.clearFn = function(){
        console.log('remove clicked!!');
         $route.reload();
    }
}else{
    $location.path('/logout');
}
}]);
