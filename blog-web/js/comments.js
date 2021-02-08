//COMMENTS

app.controller('CommentsController', ['$scope', '$routeParams', 'CommentService', function ($scope, $routeParams, CommentService) {
    $scope.newCom = '';
    $scope.comments = [];

    CommentService.get($routeParams.postId).then(function (response) {
        $scope.comments = response;
    });

    $scope.create = function () {
        if ($scope.newCom.text === undefined) {
            window.alert("Empty field, write again.");
            return;
        }

        if (!(logged !== undefined && logged === false)) {
            CommentService.createComment($scope.newCom, $routeParams.postId).then(function (response) {
                if (response.message == undefined) {
                    CommentService.get($routeParams.postId).then(function (response) {
                        $scope.comments = response;
                        window.alert("Your comment was created!");
                        $scope.newCom = '';
                    });
                } else {
                    window.alert(response.message);
                }

            });
        } else {
            window.alert("Please, log in!");
        }
    }

    $scope.destroy = function (id) {
        CommentService.deleteComment($routeParams.postId, id).then(function (response) {
            if (!(logged !== undefined && logged === false)) {
                if (response.message == undefined) {
                    CommentService.get($routeParams.postId).then(function (response) {
                        $scope.comments = response;
                    });
                    window.alert("Your comment was destroyed!");
                } else {
                    window.alert(response.message);
                }
            } else {
                window.alert("Please, log in!");
            }
        });
    }

    $scope.update = function () {
        if ($scope.newCom === '') {
            window.alert("Empty field, write again.");
            return;
        }
        
        CommentService.updateComment($scope.newCom, $routeParams.postId, $routeParams.comId).then(function (response) {
            if (!(logged !== undefined && logged === false)) {
                if (response.id != undefined) {
                    window.alert("Your post was updated!");
                    window.location.href = "http://localhost/blog/#/posts/" + $routeParams.postId;
                    $scope.newCom = '';
                } else {
                    window.alert(response.message);
                }
            } else {
                window.alert("Please, log in!");
            }
        });
    }
}]);


app.service('CommentService', function ($http) {
    function createComment(data, id) {
        return $http.post(`http://localhost:3000/posts/` + id + `/comments`, JSON.stringify({
            comment: data
        }), {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }

    function get(id) {
        return $http.get(`http://localhost:3000/posts/` + id + `/comments.json`).then((response) => response.data);
    }

    function deleteComment(idPost, idComment) {
        return $http.delete(`http://localhost:3000/posts/` + idPost + `/comments/` + idComment, {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }

    function updateComment(data, idPost, idComment) {
        return $http.put(`http://localhost:3000/posts/` + idPost + `/comments/` + idComment, JSON.stringify({
            comment: data
        }), {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }
    return {
        createComment,
        get,
        deleteComment,
        updateComment
    }
});