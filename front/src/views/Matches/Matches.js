import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'

import {AppContext} from 'AppContext'
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
    const {userId} = useParams();
    const [match, setMatch] = useState();
    const [candidates, setCandidates] = useState();
    const appContext = useContext(AppContext);

    useEffect(() => {
        appContext.adminDataApi.getMatching(userId)
            .then(({data}) => {
                setMatch(data);
                if (data.matchRequestId)
                    appContext.adminDataApi.getMatchingCandidates(userId, data.matchRequestId)
                        .then(({data}) => setCandidates(data))
            })
    }, [])
    console.log(match, candidates)
    if (match && !candidates) {
        return (
            <h1 style={{margin: 'auto'}}> Нет матчей</h1>
        )
    }
    
    if (!match || !candidates) {
        return null;
    }

    

    

   

    return (
        <div style={{maxWidth: 1200, margin: '0 auto'}}>
            <TableContainer  component={Paper}>
            <Table  aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Тема</TableCell>
                <TableCell >Кандидаты</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            
                <TableRow>
                    <TableCell> {match.matchRequestId} </TableCell>
                    <TableCell> {match.topicText}</TableCell>
                    <TableCell> {JSON.stringify(candidates)}</TableCell>
                </TableRow>
            
            </TableBody>
            </Table>
         </TableContainer>
        </div>
    )
}

export default Matches;