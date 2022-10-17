import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useHistory } from "react-router-dom";
import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./commentSection";
import useStyles from "./Styles";

const PostDetails = () => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  // const [search, setSearch] = useState("none");
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  // useEffect(() => {
  //   if (post) {
  //     dispatch(getPostsBySearch({ search, tags: post?.tags.join(",") }));
  //   }
  // }, [post]);

  if (!post) return null;

  if (isLoading) {
    return (
      <Paper className={classes.loadingPaper} elevation={6}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  const openPost = (_id) => history.push(`/posts/${_id}`);

  return (
    <Paper style={{ padding: "20px", boredrRadius: "15px" }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }}></Divider>
          <Typography variant="body1">
            <strong>Reacttime Chat - coming soon !</strong>
          </Typography>
          <Divider style={{ margin: "20px 0" }}></Divider>
          <CommentSection post={post} />
          <Divider style={{ margin: "20px 0" }}></Divider>
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={
              post.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={post.title}
          />
        </div>
      </div>
      {recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might aloso like:
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(
              ({ title, message, name, likes, selectedFile, _id }) => (
                <div
                  className=""
                  style={{ margin: "20px", cursor: "pointer" }}
                  onClick={() => openPost(_id)}
                  key={_id}
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {message}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    Likes: {likes.length}
                  </Typography>
                  <img src={selectedFile} alt={title} width="200px" />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default PostDetails;
