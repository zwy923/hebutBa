import React, { useState, useEffect } from 'react';
import CodeSnippet from './Card4CodeSnippet';

const Main = ({ onLogout }) => {
  const [codeSnippets, setCodeSnippets] = useState([]);

  useEffect(() => {
    const fetchCodeSnippets = async () => {
      try {
        const response = await fetch('http://localhost:1234/api/user/codesnippets');
        const data = await response.json();
        setCodeSnippets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCodeSnippets();
  }, []);

  return (
    <>
      <div>
        {codeSnippets.map((snippet) => (
          <CodeSnippet key={snippet._id} snippet={snippet} />
        ))}
      </div>
    </>
  );
};

export default Main;
