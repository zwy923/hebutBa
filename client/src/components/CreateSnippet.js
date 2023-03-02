import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';


const CreateSnippet = () => {

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: handle form submission
  };

  return (
    <Box>
      <Typography variant="h4">Create New Snippet</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="title"
          label="Title"
          fullWidth
          value={title}
          onChange={handleTitleChange}
          margin="normal"
        />
        <TextField
          id="code"
          label="Code"
          fullWidth
          multiline
          rows={10}
          value={code}
          onChange={handleCodeChange}
          margin="normal"
        />
        <TextField
          id="tags"
          label="Tags"
          fullWidth
          value={tags}
          onChange={handleTagsChange}
          margin="normal"
        />
        
        <Button type="submit" variant="contained" color="primary">
          Create Snippet
        </Button>
      </form>
    </Box>
  );
};

export default CreateSnippet;
