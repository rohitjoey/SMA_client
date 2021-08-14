import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";
import { FETCH_POST_QUERY } from "../util/graphql";
import { useForm } from "./../util/hooks";

const PostForm = () => {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  });

  // const { error } = useMutation(CREATE_POST_MUTATION);

  // console.log(error);

  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,

    update(proxy, result) {
      // console.log(result);
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY,
      });

      // data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      // console.log(data);

      values.body = "";
    },

    onError(err) {
      return err;
    },
  });

  function createPostCallback() {
    createPost();
  }

  // console.log(values.body);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post</h2>
        <Form.Field>
          <Form.Input
            type="text"
            placeholder="Hello"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />

          {loading ? (
            <Button loading primary>
              Loading
            </Button>
          ) : (
            <Button type="submit" primary>
              Post
            </Button>
          )}
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        username
        createdAt
        body
      }
      likeCount
      commentCount
    }
  }
`;

export default PostForm;
