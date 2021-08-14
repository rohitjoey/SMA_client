import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image, Label, Popup } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";

const PostCard = ({
  post: {
    id,
    username,
    body,
    createdAt,
    likeCount,
    likes,
    commentCount,
    comments,
  },
}) => {
  const { user } = useContext(AuthContext);

  // const likePost = () => {
  //   console.log("Post liked");
  // };

  // const commentOnPost = () => {
  //   console.log("Comment on post");
  // };

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://i.kinja-img.com/gawker-media/image/upload/t_original/ijsi5fzb1nbkbhxa2gc1.png"
        />

        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description style={{ overflowWrap: "anywhere" }}>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <Popup
          content="Comment"
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="teal" size="tiny" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="teal" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
