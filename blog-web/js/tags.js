//TAGS

app.service('TagService', function ($http) {
    function get() {
        return $http.get(`http://localhost:3000/tags.json`).then((response) => response.data);
    }

    function linkTag(postId, id) {
        return $http.post(`http://localhost:3000/posts/` + postId + `/tag.json`, {
            post: {
                tag_id: id
            }
        }, {
            headers: {
                'Authorization': logged.token
            }
        }).then((response) => response.data);
    }

    function unlinkTag(postId, id) {
        return $http({
            method: 'DELETE',
            url: `http://localhost:3000/posts/` + postId + `/tag.json`,
            data: {
                post: {
                    tag_id: id
                }
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8',
                'Authorization': logged.token
            }
        })

    }
    return {
        get,
        linkTag,
        unlinkTag
    }
})