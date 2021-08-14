import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { Grid, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { FETCH_POST_QUERY } from "../util/graphql";
import PostCard from "./../components/PostCard";
import PostForm from "./../components/PostForm";

function Home() {
  const { loading, data, error } = useQuery(FETCH_POST_QUERY);

  if (error) {
    console.log(`Error! ${error.message}`);
  }

  const { user } = useContext(AuthContext);
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>

      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}

        {loading ? (
          <h2>Loading posts...</h2>
        ) : (
          <Transition.Group duration={300}>
            {data.getPosts &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 32 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
