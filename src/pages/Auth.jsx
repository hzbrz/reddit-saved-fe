import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


const Auth = () => {
  const [authUrl, setauthUrl] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!document.cookie) {
      ( async () => {
          const { data } = await axios.get('http://localhost:8080/');
          setRedirect(true);
          setauthUrl(data);
        }
      )();
    }
  }, []);

  if (document.cookie)
    return <Navigate to='/init' />
  
  if (redirect)
    window.location.href = authUrl;
  return (
    <>
      <h4>Loading...</h4>
    </>
  );
}

export default Auth;
