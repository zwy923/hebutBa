import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import { Checkbox } from '@mui/material';

const CreateSnippet = ({token}) => {

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('')
  
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const label = { inputProps: { 'yes': 'no' } };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:1234/api/user/codeSnippets',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title,
          code,
          tags,
          description
        })
      })
      const data = await response.json();
      if (response.ok) {
        console.log(data)
        alert("Successful!")
        navigate('/')
        window.location.reload()
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Paper variant="elevation" sx={{ margin: 4}}>
      <Typography variant="h4">Create New Snippet</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="title"
          label="Title"
          value={title}
          onChange={handleTitleChange}
          margin="normal"
        />

        <TextField
          id="tags"
          label="Tags"
          value={tags}
          onChange={handleTagsChange}
          margin="normal"
        />
        <br />
        <TextField
          id="description"
          fullWidth
          rows={5}
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          margin="normal"
        />
        <br />
        <TextField
          id="code"
          label="Markdown"
          fullWidth
          multiline
          rows={10}
          value={code}
          onChange={handleCodeChange}
          margin="normal"
        />
        <Box  margin="normal" border={1} height={200}>
        <Typography variant="subtitle1" component="div">
          Preview
        </Typography>
        
        <ReactMarkdown sx={{ textAlign: 'left' }}
          className="markdown-preview"
          children={code}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <Box component="pre"  className={`hljs ${className}`} sx={{ textAlign: 'left' }}>
                  <code
                    className={`hljs ${className}`}
                    sx={{ textAlign: 'left' }}
                    {...props}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlightAuto(children, [match[1]]).value,
                    }}
                  />
                </Box>
              ) : (
                <code className={className}  {...props} sx={{ textAlign: 'left' }}>
                  {children}
                </code>
              );
            },
          }}
        />
        </Box>

        <Button variant="contained" sx={{margin:2}} endIcon={<SendIcon />} onClick={handleSubmit}>
          Create
        </Button>Anonymous
        <Checkbox {...label} defaultChecked />    
      </form>
    </Paper>
  );
};

export default CreateSnippet;
