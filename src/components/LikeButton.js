import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label, Popup } from "semantic-ui-react";

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setliked] = useState(false);

  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: id },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
    // update(_, result) {
    //   console.log(result);
    // },
  });

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setliked(true);
    } else setliked(false);
  }, [user, likes]);

  const likeButton = user ? (
    liked ? (
      <Button color="red" size="tiny">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="red" size="tiny" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="red" size="tiny" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Popup
      content={liked ? "Unlike" : "Like"}
      trigger={
        <Button as="div" labelPosition="right" onClick={likePost}>
          {likeButton}
          <Label basic color="red" pointing="left">
            {likeCount}
          </Label>
        </Button>
      }
    />
  );
};

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    # yo red ma vako chai mutation ko name ho server sanga milna parne
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
