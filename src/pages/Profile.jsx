import axios from "axios";
import { Navigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const Profile = () => {
  let [searchParams, setSearchParams] = useSearchParams()
  const [redirect, setRedirect] = useState(false);
  const code = searchParams.get("code")

  // if I were to set expires instead of max-age
  // let now = new Date();
  // let time = now.getTime();
  // time += 3600 * 1000;
  // now.setTime(time);
  // expires=${now.toUTCString()} on the document.cookie after hasAccess 

  useEffect(() => {
    if (!document.cookie) {
      (
        async () => {
          const { data } = await axios.post('ccd', {
            code
          });
          // console.log(data);
          document.cookie = `hasAccess=${data['token']};max-age=3600;`
          setRedirect(true);
        }
      )();
    }
  }, [])

  if (document.cookie)
    return <Navigate to='/init' />
  
  if (redirect)
    return <Navigate to='/init' />
  return (
    <>
      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Loading...</h3>
    </>
  );
}

export default Profile;
