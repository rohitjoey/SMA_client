import { useMutation, useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Popup,
} from "semantic-ui-react";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";

function SinglePost(props) {
  const { user } = useContext(AuthContext);

  const [commentBody, setcommentBody] = useState("");
  const commentInputRef = useRef(null);

  const postId = props.match.params.postId;
  // console.log(postId);

  const { data } = useQuery(FETCH_SINGLE_POST, {
    variables: { postId },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
  });

  // console.log(data);

  const [createComment, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: { postId, body: commentBody },
    update() {
      setcommentBody("");
      commentInputRef.current.blur();
    },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading...</p>;
  } else {
    const {
      id,
      body,
      username,
      createdAt,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="huge"
              src="https://i.kinja-img.com/gawker-media/image/upload/t_original/ijsi5fzb1nbkbhxa2gc1.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description style={{ overflowWrap: "anywhere" }}>
                  {body}
                </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup
                  content="Comment"
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => commentInputRef.current.focus()}
                    >
                      <Button basic color="teal" size="tiny">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="teal" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <>
                <h2>Post a comment</h2>
                <Form noValidate>
                  <div className="ui action input flui">
                    <input
                      type="text"
                      name="comment"
                      value={commentBody}
                      onChange={(event) => setcommentBody(event.target.value)}
                      ref={commentInputRef}
                    />

                    {loading ? (
                      <Button
                        color="teal"
                        loading
                        disabled={commentBody.trim() === ""}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        color="teal"
                        onClick={createComment}
                        disabled={commentBody.trim() === ""}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </Form>
              </>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const FETCH_SINGLE_POST = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likes {
        username
      }
      likeCount
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default SinglePost;
