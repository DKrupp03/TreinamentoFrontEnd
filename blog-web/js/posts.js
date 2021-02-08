//POSTS

app.controller('BlogController', ['$scope', 'postService', '$routeParams', function ($scope, postService, $routeParams) {
    $scope.logged = logged;
    $scope.postsAPI = {};
    $scope.tagsAPI = {};

    postService.get().then(function (response) {
        $scope.postsAPI = response;
    });
}]);


app.controller('PostsController', ['$scope', '$routeParams', 'postService', 'TagService', function ($scope, $routeParams, postService, TagService) {
    $scope.postAPI = {};
    $scope.comments = [];
    $scope.newPost = '';
    $scope.tagsAll = {};
    $scope.tags = [];

    postService.getPost($routeParams.postId).then(function (response) {
        $scope.postAPI = response;
        $scope.comments = $scope.postAPI.comments;
        $scope.tags = $scope.postAPI.tags;
    });

    TagService.get().then(function (response) {
        $scope.tagsAll = response;
    });

    $scope.actionsTag = function (id, name) {
        if ($scope.tags.length != 0) {
            for (i = 0; i < $scope.tags.length; i++) {
                if ($scope.tags[i].name.includes(name)) {
                    TagService.unlinkTag($routeParams.postId, id).then(function (response) {
                        if (response.data.message != undefined) {
                            window.alert(response.data.message);
                        } else {
                            $scope.tags = response.data;
                            window.alert("The tag was unlinked!");
                        }
                    });
                    return
                }
            }
        }

        TagService.linkTag($routeParams.postId, id).then(function (response) {
            if (response.message != undefined) {
                window.alert(response.message);
            } else {
                $scope.tags = response;
                window.alert("The tag was successfully linked!");
            }
        });
    }

    $scope.destroy = function () {
        postService.deletePost($routeParams.postId).then(function (response) {
            if (!(logged !== undefined && logged === false)) {
                if (response.id != undefined) {
                    window.alert("Your post was destroyed!");
                    window.location.href = "http://localhost/blog/#/";
                } else {
                    if (response.message) {
                        window.alert(response.message);
                    } else {
                        window.alert(response.error);
                    }
                }
            } else {
                window.alert("Please, log in!");
            }
        });
    }

    $scope.update = function () {
        if ($scope.newPost == '') {
            window.alert("Empty field, write again.");
            return;
        }

        postService.updatePost($routeParams.postId, $scope.newPost).then(function (response) {
            if (!(logged !== undefined && logged === false)) {
                if (response.id != undefined) {
                    window.alert("Your post was updated!");
                    $scope.newPost == '';
                    window.location.href = "http://localhost/blog/#/";
                } else {
                    window.alert(response.message);
                }
            } else {
                window.alert("Please, log in!");
            }
        });
    }

    $scope.create = function () {
        if ($scope.newPost == '') {
            window.alert("Empty field, write again.");
            return;
        }

        postService.createPost($scope.newPost, logged).then(function (response) {
            if (!(logged !== undefined && logged === false)) {
                if (response.id != undefined) {
                    window.alert("Your post was created!");
                    $scope.newPost == '';
                    window.location.href = "http://localhost/blog/#/";
                } else {
                    window.alert(response.message);
                }
            } else {
                window.alert("Please, log in!");
            }
        });
    }

}]);


app.service('postService', function ($http) {
    function get() {
        return $http.get(`http://localhost:3000/posts.json`).then((response) => response.data);
    }

    function getPost(id) {
        return $http.get(`http://localhost:3000/posts/` + id + `.json`).then((response) => response.data);
    }

    function deletePost(id) {
        return $http.delete(`http://localhost:3000/posts/` + id + `.json`, {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }

    function updatePost(id, data) {
        return $http.put(`http://localhost:3000/posts/` + id + `.json`, JSON.stringify({
            post: data
        }), {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }

    function createPost(data) {
        return $http.post(`http://localhost:3000/posts`, JSON.stringify({
            post: data
        }), {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }
    return {
        get,
        getPost,
        deletePost,
        updatePost,
        createPost
    };
});