import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
function BookDetail() {
  const { bookName } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:1234/api/book/${bookName}`);
      if (response.ok) {
        const data = await response.json();
        setBook(data);
      } else {
        console.error(response.statusText);
      }
    };
    fetchData();
  }, [bookName]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{book.name}</p>
      <p>{book.author}</p>
      <p>{book.pages}</p>
    </div>
  );
}

export default BookDetail;