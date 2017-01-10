var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'list.html', controller: 'ListCtrl'
  }).when('/users/new', {
    templateUrl: 'create.html', controller: 'EditCtrl'
  }).when('/users/:_id', {
    templateUrl: 'edit.html', controller: 'EditCtrl'
  }).when('/drops', {
    templateUrl: 'drops.html', controller: 'DropsCtrl'
  }).otherwise({
    redirectTo: '/users'
  });
});

// 使用API
app.factory('User', function($resource) {
  return $resource('/api/users/:_id');
});
app.factory('Drops', function($resource) {
  return $resource('/api/drops/:_id');
});

app.controller('ListCtrl', function($scope, $route, User) {
  console.log("ListCtrl---------------");

  $scope.users = User.query();
  $scope.delete = function(_id) {
    User.delete({_id: _id}, function() {
      $route.reload();
    });
  };
});

app.controller('DropsCtrl', function($scope, $route, Drops) {
  console.log("DropsCtrl---------------");

  $scope.users = Drops.query();
  $scope.recovery = function(_id) {
    Drops.delete({_id: _id}, function() {
      $route.reload();
    });
  };
});

app.controller('EditCtrl', function($scope, $routeParams, $location, User) {
  console.log("EditCtrl---------------");

  if ($routeParams._id != 'new') $scope.user = User.get({_id: $routeParams._id});
  $scope.edit2 = function() {
    User.save($scope.user, function() {
      $location.url('/');
    });
  };
});