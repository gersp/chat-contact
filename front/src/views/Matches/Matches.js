import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { AppContext } from 'AppContext'
import {
  Card, Typography,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@material-ui/core';

const Matches = () => {
  const { userId } = useParams();
  const [match, setMatch] = useState();
  const [candidates, setCandidates] = useState();
  const appContext = useContext(AppContext);

  useEffect(() => {
    appContext.adminDataApi.getMatching(userId)
      .then(({ data }) => {
        setMatch(data);
        if (data.matchRequestId)
          appContext.adminDataApi.getMatchingCandidates(userId, data.matchRequestId)
            .then(({ data }) => setCandidates(data))
      })
  }, [userId])
 
  if (match && candidates && candidates.length === 0) {
    return (
      <h1 style={{ margin: 'auto' }}> Нет матчей</h1>
    )
  }

  if (!match || !candidates) {
    return null;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto' }}>
      <Button variant='contained' style={{margin: '10px 0'}} onClick={() => appContext.history.push('/')}>
        Список пользователей
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell >Status</TableCell>
              <TableCell >ContraStatus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              candidates.map(candidate => (
                <TableRow onClick={() => appContext.history.push('/matching/' + candidate.user.userId)} style={{cursor: 'pointer'}}> 
                  <TableCell> {candidate.user.userId} </TableCell>
                  <TableCell> {candidate.user.displayName}</TableCell>
                  <TableCell><span style={{color: candidate.status === 'liked' ? 'green' : candidate.status === 'disliked' ? 'red' : 'gray'}}>
                      {
                        candidate.status || 'pending'
                      }
                    </span> 
                  </TableCell>
                  <TableCell> 
                    <span style={{color: candidate.contraStatus === 'liked' ? 'green' : candidate.contraStatus === 'disliked' ? 'red' : 'gray'}}>
                      {
                        candidate.contraStatus || 'pending'
                      }
                    </span> 
                  </TableCell>
                </TableRow>
              ))
            }
            

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Matches;