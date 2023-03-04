import React, { useState, useEffect } from 'react';
import CodeSnippet from './Card4CodeSnippet';
import jwtDecode from 'jwt-decode';


const Main = ({token}) => {
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [id,setId] = useState('')
  const [role,setRole] = useState('')
  
  useEffect(() => {
    
    if(token){
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem('authToken')
      } else {
        const { _id, role } = decodedToken;
        setId(_id)
        setRole(role)
      }
    }
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
          <CodeSnippet
          key={snippet._id}
          snippet={snippet}
          token={token}
          role={role}
          editable={snippet.user === id || role === 'admin'}
        />
        ))}
      </div>
    </>
  );
};

export default Main;
