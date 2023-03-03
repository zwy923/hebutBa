import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import 'highlight.js/styles/vs2015.css'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

const DetailSnippet = ({ open, handleClose, snippet, name}) => {
  const { title, code, tags, createdAt, updatedAt} = snippet;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Author: {name}
        </Typography>

        <ReactMarkdown
          children={code}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={dark}
                language={match[1]}
                PreTag="div"
                {...props}
            />
          ) : (
            <code className={className} {...props}>
            {children}
            </code>
            )
          }
        }}
       />

        <Typography variant="subtitle1" gutterBottom>
          Created At: {new Date(createdAt).toLocaleString()}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Updated At: {new Date(updatedAt).toLocaleString()}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Tags: {tags}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailSnippet;
