



import React, { useState, useEffect } from 'react';




const CreateComment = (token,snippetId) =>{

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
              codeSnippetId: snippetId,
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

}