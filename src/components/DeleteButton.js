import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { FETCH_POST_QUERY } from "../util/graphql";

const DeleteButton = ({ postId, callback, commentId }) => {
  const [confirmOpen, setconfirmOpen] = useState(false);
  // console.log(postId);

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;
  const [deletePostOrComment, { loading }] = useMutation(mutation, {
    variables: { postId, commentId },
    update(proxy, result) {
      // console.log(result);

      setconfirmOpen(false);
      if (callback) callback();
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POST_QUERY,
        });

        // data.getPosts = [result.data.createPost, ...data.getPosts];
        proxy.writeQuery({
          query: FETCH_POST_QUERY,
          data: {
            getPosts: [result.data.deletePost, ...data.getPosts],
          },
        });
      }
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
  });

  return (
    <>
      {loading ? (
        <Button as="div" color="red" size="tiny" floated="right" loading>
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      ) : (
        <Popup
          content={commentId ? "Delete Comment" : "Delete Post"}
          trigger={
            <Button
              as="div"
              color="red"
              size="tiny"
              floated="right"
              onClick={() => setconfirmOpen(true)}
            >
              <Icon name="trash" style={{ margin: 0 }} />
            </Button>
          }
        />
      )}

      <Confirm
        open={confirmOpen}
        onCancel={() => setconfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
