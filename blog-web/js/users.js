//USERS

app.controller('UsersController', ['$scope', '$routeParams', 'userService', function ($scope, $routeParams, userService) {
    $scope.user = {};
    $scope.newUser = '';
    $scope.login = {
        'name': '',
        'password': ''
    };

    $scope.create = function () {
        if ($scope.newUser == '') {
            window.alert("Empty field, write again.");
            return;
        }
        if (!$scope.newUser.email) {
            window.alert("Invalid email!");
            return;
        }

        userService.createUser($scope.newUser).then(function (response) {
            if (response.user.email) {
                window.alert("User was saved!");
                window.location.href = "http://localhost/blog/#/";
            } else {
                window.alert(response.error);
            }
        });
    };

    $scope.signin = function () {
        userService.signin($scope.login).then(function (response) {
            if (response.token != undefined) {
                window.alert("You are logged!");
                logged = response;
                window.location.href = "http://localhost/blog/#/";
            } else {
                window.alert(response.error);
            }
        });
    };

    $scope.update = function () {
        if ($scope.newPost == '') {
            window.alert("Empty field, write again.");
            return;
        }
        if (!$scope.newUser.email) {
            window.alert("Invalid email!");
            return;
        }

        if (!(logged !== undefined && logged === false)) {
            userService.updateUser($scope.newUser).then(function (response) {
                if (response.email.length > 0) {
                    window.alert("User was updated!");
                    window.location.href = "http://localhost/blog/#/";
                } else {
                    window.alert(response.error);
                }
            });
        } else {
            window.alert("Please, log in!");
        }
    };

    $scope.destroy = function () {
        if (!(logged !== undefined && logged === false)) {
            userService.deleteUser().then(function (response) {
                if (response != undefined) {
                    window.alert("Your account was destroyed!");
                    window.location.href = "http://localhost/blog/#/";
                    location.reload();
                } else {
                    window.alert(response.error);
                }
            });
        } else {
            window.alert("Please, log in!");
        }
    };

    $scope.signout = function () {
        if (!(logged !== undefined && logged === false)) {
            window.alert("You were desconected");
            logged = false;
        } else {
            window.alert("You aren't logged");
        }
    }
}]);


app.service('userService', function ($http) {
    function createUser(data) {
        return $http.post(`http://localhost:3000/users`, JSON.stringify({
            user: data
        }), {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }

    function signin(data) {
        return $http.post(`http://localhost:3000/login`, JSON.stringify(data))
            .then((response) => response.data);
    }

    function updateUser(data) {
        return $http.put(`http://localhost:3000/users/` + logged.user.id + `.json`, JSON.stringify({
            user: data
        }), {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }

    function deleteUser() {
        return $http.delete(`http://localhost:3000/users/` + logged.user.id + `.json`, {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }
    return {
        createUser,
        signin,
        updateUser,
        deleteUser
    }
});