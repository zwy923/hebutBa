import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css'

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
            className="markdown"
            children={code}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <pre className={`hljs ${className}`}>
                    <code
                      className={`hljs ${className}`}
                      {...props}
                      dangerouslySetInnerHTML={{
                        __html: hljs.highlightAuto(children, [match[1]]).value,
                      }}
                    />
                  </pre>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
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
