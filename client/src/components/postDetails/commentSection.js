import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Typography, TextField, Button } from "@material-ui/core";
import { commentPost } from "../../actions/posts";

import useStyles from "./Styles";

const CommentSection = ({ post }) => {
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const commentsRef = useRef();
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleClick = async () => {
    const finalComment = `${user.result.name}: ${comment}`;
    const newComments = await dispatch(commentPost(finalComment, post._id));
    setComments(newComments);
    setComment("");

    commentsRef.current.scrollIntoView({ behaviour: "smooth" });
  };

  return (
    <div className="">
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments?.map((singleComment, index) => (
            <Typography key={index} gutterBottom variant="subtitle1">
              <strong style={{ color: "blue" }}>
                {singleComment.split(": ")[0]}
              </strong>
              {singleComment.split(":")[1]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div className="" style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">
              Write a comment
            </Typography>
            <TextField
              fullWidth
              rows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              disabled={!comment}
              variant="contained"
              color="primary"
              onClick={handleClick}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
