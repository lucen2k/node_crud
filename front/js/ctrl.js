var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'list.html', controller: 'ListCtrl'
  }).when('/users/new', {
    templateUrl: 'create.html', controller: 'EditCtrl'
  }).when('/users/:_id', {
    templateUrl: 'edit.html', controller: 'EditCtrl'
  }).otherwise({
    redirectTo: '/users'
  });
});

app.factory('User', function($resource) {
  return $resource('/api/users/:_id');
});

app.controller('ListCtrl', function($scope, $route, User) {
  $scope.users = User.query();
  $scope.delete = function(_id) {
    User.delete({_id: _id}, function() {
      $route.reload();
    });
  };
});

app.controller('EditCtrl', function($scope, $routeParams, $location, User) {
  if ($routeParams._id != 'new') $scope.user = User.get({_id: $routeParams._id});
  $scope.edit = function() {
    User.save($scope.user, function() {
      $location.url('/');
    });
  };
});