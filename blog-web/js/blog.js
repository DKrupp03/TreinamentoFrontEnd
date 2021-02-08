var app = angular.module('Blog', ['ngRoute']);
var logged = false;


var checkLoggin = function () {
    if (logged !== undefined && logged === false) {
        window.alert("Please, log in!");
        window.location.href = "http://localhost/blog/#/users/signin";
        return false;
    }
    return true;
}

//routes config
app.config(['$routeProvider', function config($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'pages/home.html'
    }).
    when('/posts/:postId', {
        controller: 'PostsController',
        templateUrl: 'pages/posts/post.html'
    }).
    when('/posts/update/:postId', {
        controller: 'PostsController',
        templateUrl: 'pages/posts/postUpdate.html',
        resolve: {
            checkLoggin
        }
    }).
    when('/new', {
        controller: 'PostsController',
        templateUrl: 'pages/posts/postCreate.html',
        resolve: {
            checkLoggin
        }
    }).
    when('/users/create', {
        controller: 'UsersController',
        templateUrl: 'pages/users/userCreate.html'
    }).
    when('/users/signin', {
        controller: 'UsersController',
        templateUrl: 'pages/users/signIn.html'
    }).
    when('/users/update', {
        controller: 'UsersController',
        templateUrl: 'pages/users/userUpdate.html',
        resolve: {
            checkLoggin
        }
    }).
    when('/posts/:postId/comments/:comId', {
        controller: 'CommentsController',
        templateUrl: 'pages/comments/commentUpdate.html',
        resolve: {
            checkLoggin
        }
    }).
    when('/posts/:postId/tags', {
        controller: 'PostsController',
        templateUrl: 'pages/tags/link.html',
        resolve: {
            checkLoggin
        }
    });
}]);


//BLOG
app.controller('BlogController', ['$scope', 'postService', '$routeParams', function ($scope, postService, $routeParams) {
    $scope.postsAPI = {};
    $scope.tagsAPI = {};

    postService.get().then(function (response) {
        $scope.postsAPI = response;
    });
}]);

app.controller('ApplicationController', ['$scope', function ($scope) {
    $scope.getUser = function () {
        return logged;
    }
}]);