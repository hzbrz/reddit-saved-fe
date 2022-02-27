import { useEffect, useState } from "react";
import axios from 'axios';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Navigate } from "react-router-dom";

const Saved = () => {
  const [cats, setCats] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);


  useEffect(() => {
    if (!sessionStorage.getItem('catArr')) {
      (
        async () => {
          const { data } = await axios.post('cats', {
            token: document.cookie.split('=')[1]
          });
          setCats(data);
          setIsLoading(false);
          sessionStorage.setItem('catArr', JSON.stringify(data));
        }
      )();
    } else { 
      console.log('Cat is in session!'); 
      setCats(JSON.parse(sessionStorage.getItem('catArr'))); 
      setIsLoading(false); 
    }
  }, []);

  const bringSaved = async (subreddit) => {
    if (!sessionStorage.getItem(`${subreddit}`)) {
      console.log(`getting saved posts from ${subreddit}`);
      const { data } = await axios.post('getSaved', {
        subreddit
      });
      console.log(data.savedArr.length)
      setSavedPosts(data.savedArr);
      setSubLoading(false);
      sessionStorage.setItem(`${subreddit}`, JSON.stringify(data.savedArr));
    } else {
      console.log(subreddit+' is cached already');
      setSavedPosts(JSON.parse(sessionStorage.getItem(`${subreddit}`)));
      setSubLoading(false);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setSubLoading(true);
  };


  if (!document.cookie) {
    return <Navigate to="/" />
  } else {

    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
          <CircularProgress color="success" size={'7rem'} thickness={3} />
          <p style={{ fontSize: '30px' }}>Loading in your Subreddits!</p>
        </Box>
      );
    }
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Saved Posts from most used subreddits</h2>
        <div style={{ width: '70%' }}>
          {cats.map((cat, index) => {
            return (
              <Accordion key={index} 
                expanded={expanded === cat} 
                TransitionProps={{ unmountOnExit: true }} 
                onClick={() => bringSaved(cat)} onChange={handleChange(cat)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  {cat}
                </AccordionSummary>
                <AccordionDetails>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>URL</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Permalink</TableCell>
                        <TableCell>Thumbnail</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subLoading ?
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            <CircularProgress color="success" size={'3rem'} thickness={3} />
                            <p style={{ fontSize: '15px' }}>Loading in your posts!</p>
                          </TableCell>
                        </TableRow>
                        :
                        savedPosts.map(post => {
                          return (
                            <TableRow key={post._id}>
                              {/* maybe filter null posts here? idk lol or keep it to see how many posts have been del */}
                              <TableCell><a href={post.url} target='_blank' rel="noreferrer">Link</a></TableCell>
                              <TableCell>{post.title}</TableCell>
                              <TableCell><a href={'https://reddit.com' + post.permalink} target='_blank' rel="noreferrer">Link to reddit post</a></TableCell>
                              <TableCell>
                                <img width='100px' height='40px' src={post.thumbnail} alt="thumbnail for the post" />
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
  
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </div>
      </div>
    );
  }

}

export default Saved;
