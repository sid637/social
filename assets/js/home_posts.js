{

    let noty = function(text,type){
        new Noty({
            theme: 'relax',
            text: text,
            type: type,
            layout: 'topRight',
            timeout: 1500,
        }).show();
    }

    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    // calling the create comment class
                    new PostComments(data.data.post._id);
                    noty('Post Created Successfully','success');
                    
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a post in DOM
    let newPostDom = function(post){
        // here interpolation with backticks is done
        return $(`<li id="post-${post._id}"> 
                <p>
                       
                                <small>
                                        <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                                </small>
                        
                        
                            ${ post.content }
                            <br>
                            <small>
                            ${ post.user.name }
                            </small>
                </p>
                <div class="post-comments" >
                                        
                                <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
                                        <input type="text" name="content" placeholder="type here to add comment..." required> 
                                        <input type="hidden" name="post" value="${ post._id }">
                                        <input type="submit" value="Add Comment">
                                </form>
            
                      
            
                        <div class="post-comments-list">
                                <ul id="post-comments-${ post._id }">
              
                                </ul>
                        </div>
                </div>
            </li>`)
    }


    // method to delete a post form dom
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    noty('Post Deleted Successfully', 'success')
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


// loop over all the existing posts on the page(when the window loads for th first time)
// and call the delete post method on each link of each, also add AJAX(using the class we've created) to delete the button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);


        });
    }


    createPost();
    convertPostsToAjax();
}






