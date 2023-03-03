import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

const CreateComment = (token,onCommentCreated,codeSnippetId) =>{
    console.log(codeSnippetId)
    const [commentText, setCommentText] = useState('')
    
    const handleSubmitComment = async (event) => {
        event.preventDefault();
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
          const data = await response.json();
          if (response.ok) {
            console.log(data)
            alert("Comment posted successfully!")
            setCommentText('')
          } else {
            throw new Error(data.message);
          }
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