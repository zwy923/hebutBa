import React, { useState } from 'react';

function Input(){
    const [name, setBookName] = useState('');
    const [author, setBookAuthor] = useState('');
    const [pages, setBookPages] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:1234/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, author, pages }),
        });
        if (response.ok) {
          console.log("send success!")
        } else {
          // handle error
        }
      };

    return(
        <form onSubmit={handleSubmit}>
        <label>
          Book Name:
          <input
            id='name'
            type="text"
            value={name}
            onChange={(event) => setBookName(event.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Book Author:
          <input
            id='author'
            type="text"
            value={author}
            onChange={(event) => setBookAuthor(event.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Book Pages:
          <input
            id='pages'
            type="number"
            value={pages}
            onChange={(event) => setBookPages(event.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" id='submit'>Submit</button>
      </form>
    );
};

export default Input;