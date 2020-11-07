import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
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

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: '0 auto'
  },
  countersContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 50
  },
  counter: {
    width: 250,
    height: 250,
    padding: 10,

    marginRight: 30,
    display: 'flex',
    flexDirection: 'column'
  },
  counter__name: {
    textAlign: 'center',
    fontSize: 20,
    flexShrink: 0
  },
  counter__count: {
    fontSize: 85,
    flexGrow: 1,
    fontWeight: 'bold',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'

  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  toolbar: {
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'flex-end',
  }
}));

const Home = () => {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  const [counters, setCounters] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
    appContext.adminDataApi.getCounters()
      .then(({data}) => setCounters(data))
    appContext.adminDataApi.listUsers()
      .then(({data}) => setUsers(data))
    appContext.adminDataApi.getMatchingCandidates(1, 1)
      .then(({data}) => console.log(data))
  }, [])

  if (!counters || !users) {
    return null
  }

  return (
    <div className={classes.root}>
      <div className={classes.countersContainer}>
        <Card className={classes.counter}>
          <Typography className={classes.counter__name}>
            Количество анкет
          </Typography>
          <Typography className={classes.counter__count}>
            {counters.countForms}
          </Typography>
        </Card>
        <Card className={classes.counter}>
          <Typography className={classes.counter__name}>
            Количество матчей
          </Typography>
          <Typography className={classes.counter__count}>
            {counters.countMathes}
          </Typography>
        </Card>
      </div>

      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell >Имя</TableCell>
            <TableCell >Фото</TableCell>
            <TableCell >Интересы</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index} onClick={() => appContext.history.push('/matching/' + user.userId)}>
              <TableCell component="th" scope="row">
                {user.userId}
              </TableCell>
              <TableCell>{user.displayName}</TableCell>
              <TableCell><img className={classes.avatar} src={user.imageLink || 'https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png'}/> </TableCell>
              <TableCell>{user.interestsText}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default Home;