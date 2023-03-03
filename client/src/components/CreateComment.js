import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

// These fucking parameters have to be enclosed in brackets!
const CreateComment = ({token,onCommentCreated,codeSnippetId}) =>{
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    console.log(token)
    try {
      const response = await fetch('http://localhost:1234/api/user/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          text: commentText,
          codeSnippetId: codeSnippetId,
          vote: 0
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setCommentText('');
      onCommentCreated(); // invoke the callback function
    } catch (error) {
      alert(error.message);
    }
  };

    return (
        <div>
          <TextField
            label="Post a comment"
            multiline
            fullWidth
            value={commentText.toString()}
            onChange={(event) => setCommentText(event.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button type="submit" variant="contained" onClick={handleSubmitComment} color="primary">
            Comment
          </Button>
        </div>
      );

}

export default CreateComment;