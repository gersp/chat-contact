import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import { Card, CardContent, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import ListItemText from '@material-ui/core/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import DropDownMenu from '../../../../components/DropDownMenu/DropDownMenu';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {},
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: 'flex-end',
  },
  fab: {
    margin: theme.spacing(1),
  },
}));

export const shorternTime = time => {
  return moment(time).format('DD MMMM YYYY HH:mm');
};

const MeetupsTable = props => {
  const { className, meetups, handleDelete, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название мероприятия</TableCell>
                <TableCell>Дата начала</TableCell>
                <TableCell>Дата окончания</TableCell>
                <TableCell>Количество посетителей</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meetups.map(meetup => (
                <TableRow className={classes.tableRow} hover key={meetup.meetupId}>
                  <TableCell>
                    <RouterLink to={'/m/' + meetup.meetupId + '/visitor'}>{meetup.name}</RouterLink>
                  </TableCell>
                  <TableCell style={{ width: '200px' }}>{shorternTime(meetup.startTime)}</TableCell>
                  <TableCell style={{ width: '200px' }}>{shorternTime(meetup.endTime)}</TableCell>
                  <TableCell style={{ textAlign: 'center', width: '200px' }}>{meetup.visitorsCount}</TableCell>
                  <TableCell style={{ textAlign: 'center', width: '100px' }}>
                    <DropDownMenu>
                      <MenuItem>
                        <RouterLink to={'/meetup/id/' + meetup.meetupId}>
                          <ListItemText primary='Редактировать' />
                        </RouterLink>
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(meetup.meetupId)}>
                        <ListItemText primary='Закрыть' />
                      </MenuItem>
                    </DropDownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

MeetupsTable.propTypes = {
  className: PropTypes.string,
  meetups: PropTypes.array.isRequired,
  handleDelete: PropTypes.func,
};

export default MeetupsTable;
