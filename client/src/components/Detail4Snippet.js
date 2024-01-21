import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import 'highlight.js/styles/vs2015.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CreateComment from './CreateComment';
import CommentCard from './Card4Comment';
import TypewriterEffect from 'react-typewriter-effect';
import CircularProgress from '@mui/material/CircularProgress';

const DetailSnippet = ({ open, handleClose, snippet, name, token, editable, role, isLoggedIn}) => {
  const { title, code, tags, createdAt, updatedAt, _id} = snippet;

  const [isLoading, setIsLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState('');
  const [commentCreated, setCommentCreated] = useState(false);
  const [comments, setComments] = useState([]);
  const handleCommentCreated = () => {
    setCommentCreated(true);
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:1234/api/user/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: code }),
      });
      const data = await response.json();
      setGptResponse(data.summary); 
      setIsLoading(false);
    } catch (error) {
      console.error('Error summarizing post:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Define an async function to fetch the comments from the API
    const fetchComments = async () => {
      const response = await fetch(`http://localhost:1234/api/user/comments/${_id}`);
      const data = await response.json();
      setComments(data.comments);
    };
    fetchComments();
  }, [commentCreated, _id]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          {name}<br />
          Updated At: {new Date(updatedAt).toLocaleString()}<br />
          ----
        </Typography>

        <ReactMarkdown
          children={code}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />

        <Typography variant="subtitle1" gutterBottom>
          
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          ----<br/>
          Created At: {new Date(createdAt).toLocaleString()}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>Tags:
          <Button size='small' variant="text">{tags}</Button>
        </Typography>

        <Button variant="contained" color="secondary" onClick={handleSummarize}>AI summarize 🪄</Button> 
        <br/><br/>
        {isLoading ? (
          <CircularProgress />
          ) : (
        gptResponse && <TypewriterEffect
          text={gptResponse}
          cursorColor="#3f51b5"
          textStyle={{ fontSize: '1.2em' }}
          startDelay={10}
          cursor="|"
          typeSpeed={10}
          deleteSpeed={10}
          delaySpeed={10}
        />
      )}
      <br/>

        <p>Comment:</p>
          <div>
            {comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} token={token} role={role} />
            ))}
          </div>
        {isLoggedIn ? (
        <CreateComment
          token={token}
          codeSnippetId={snippet._id}
          onCommentCreated={handleCommentCreated}
        />):(<p>Please login to comment.</p>)}

        {commentCreated && (
          <Typography variant="subtitle1" gutterBottom>
            Comment created successfully!
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailSnippet;
