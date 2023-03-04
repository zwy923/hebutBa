import React, {useEffect} from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardOverflow from '@mui/joy/CardOverflow';
import { Avatar } from '@mui/material';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton'
import { red } from '@mui/material/colors';
import jwtDecode from 'jwt-decode';

const CommentCard = ({ comment, token, role}) => {
  const { text, user, createdAt, _id} = comment;
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:1234/api/user/comments/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setDeleted(true);
      } else if (response.status === 401) {
        alert('You are not authorized to delete this comment.');
      } else if (response.status === 404) {
        alert('Comment not found.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      alert(`Error deleting comment: ${error.message}`);
    }
  }
  if (deleted) {
    return null;
  }

  return (
    <Card
    variant="outlined"
    sx={{ bgcolor: 'background.body' }}>
        <Box margin={1} sx={{ display: 'flex', gap: 1.5, mt: 1 ,mb:0} }>
            <Avatar variant="soft" color="neutral">
              
            </Avatar>
            <div>
              <Typography level="body2">by</Typography>
              <Typography fontWeight="lg" level="body2">
                {user.name}
              </Typography>
            </div>
        </Box>
        <br />
        <Box margin={2}>{text}</Box>
        <p style={{ textAlign: 'right', marginRight: '20px' }}>Commented at {new Date(createdAt).toLocaleString()}</p>

        <CardOverflow sx={{ p: 'var(--Card-padding)', display: 'flex' }}>
        <Input
          variant="plain"
          size="sm"
          placeholder="Add a comment…"
          sx={{ flexGrow: 1, mr: 1, '--Input-focusedThickness': '0px' }}
        />
        <Link disabled underline="none" role="button" margin={2}>
          Post
        </Link>
        {(user._id === token || role === "admin") && (
          <IconButton onClick={handleDelete}>
            <DeleteIcon sx={{ color: red[500] }} />
          </IconButton>
        )}
        </CardOverflow>
    </Card>
  );
}

export default CommentCard;
