import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CodeSnippet = ({ isLoggedIn, snippet, token}) => {
  const { title, code, tags, createdBy, createdAt, updatedAt, user, _id} = snippet;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [userName, setUserName] = useState('');

  const ITEM_HEIGHT = 48;
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setAnchorEl(null);
  };
  
  const handleDelete = async () => {
    setAnchorEl(null);
    try {
    const response = await fetch(`http://localhost:1234/api/user/codeSnippets/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      alert('Code snippet deleted successfully.');
      window.location.reload();
    } else if (response.status === 401) {
      alert('You are not authorized to delete this code snippet.');
    } else if (response.status === 404) {
      alert('Code snippet not found.');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    } catch (error) {
      alert(`Error deleting code snippet: ${error.message}`);
    }
  }


  useEffect(() => {
    const fetchUserName = async () => {
      const response = await fetch(`http://localhost:1234/api/user/getusername`,{
        method:'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user
        })});
      const data = await response.json();
      setUserName(data.name);
    };
    if (user) {
      fetchUserName();
    }
  }, [user]);
  
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 ,margin : 10}}>
      <CardHeader
        action={
          <div>
            {isLoggedIn ?(
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            ):(<></>)}
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                style: {maxHeight: ITEM_HEIGHT * 4.5,
                width: '6.8ch',},}}>

          <MenuItem key={'Edit'} onClick={handleEdit} >
            <EditIcon />
          </MenuItem>

          <MenuItem key={'Delete'} onClick={handleDelete}>
            <DeleteIcon />
          </MenuItem>
      </Menu>
    </div>}
        title={title}
        subheader={userName}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {code}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Comments</Typography>
          <Typography paragraph>
            
          </Typography>
          <Typography paragraph>
            There will be Comment
          </Typography>
          
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default CodeSnippet;
