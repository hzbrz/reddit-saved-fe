import { useEffect, useState } from "react";
import axios from 'axios';
import { Navigate } from "react-router-dom";

const Init = () => {
  const [username, setUsername] = useState('');
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem('new')) {
      (
        async () => {
          const { data } = await axios.post('getme', {
            token: document.cookie.split('=')[1]
          });
          setUsername(data.name);
          const logCheckRes = await axios.post('checkLogs', {
            name: data.name
          });
  
          if (logCheckRes.data.logCheck) {
            console.log('running smol'); 
            let newTotal, limit = 0;
            const totalSavedRes = await axios.post('totalSavedReddit', {
              token: document.cookie.split('=')[1]
            });
            limit = totalSavedRes.data.totalSaved - logCheckRes.data.logCheck.num_entries;
            newTotal = limit + logCheckRes.data.logCheck.num_entries;
            console.log(limit + ' & ' + newTotal);
            const smolRes = await axios.post('smol', {
              token: document.cookie.split('=')[1],
              name: data.name,
              limit,
              lastLoggedTotal: newTotal
            });
            console.log(smolRes.data);
            sessionStorage.setItem('new', smolRes.data.message);
            setRedirect(true);
          } else {
            console.log('running big saved');
            const savedRes = await axios.post('saved', {
              token: document.cookie.split('=')[1],
              name: data.name
            });
            console.log(savedRes.data);
            setRedirect(true);
          }
        }
      )();
    }
    sessionStorage.getItem('new') === 'Smol Insert Success' ? setRedirect(true) : console.log('updating...');;
  }, []);

  if (sessionStorage.getItem('new') === 'Nothing to update')
    return <Navigate to='/saved' />
  
  if (redirect)
    return <Navigate to='/saved' />
  return (
    <>
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>
        Loading in saved posts for user {username}...
      </h2>
    </>
  );
}

export default Init;