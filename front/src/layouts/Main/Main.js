import React, { useState, useContext } from 'react';
import { Route, useParams, Link } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Typography, Divider, MenuList, MenuItem, Button } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import BusinessIcon from '@material-ui/icons/Business';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import TextsmsIcon from '@material-ui/icons/Textsms';
import Topbar from './components/Topbar/Topbar';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    maxHeight: 'calc(100% - 64px)',
    flexGrow: 1,
    maxWidth: '100%',
  },
  main: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'auto',
  },
  main__container: {
    maxWidth: 1200,
    margin: '0 auto'
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    padding: '0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s',
  },
  drawer_reduced: {
    width: 66,
  },
  drawerPaper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
  },
  drawer__header: {
    color: '#90A4AE',
    fontSize: 11,
    padding: '21px 16px 11px 16px',
  },
  menuItem: {
    color: '#37474F',
    fontSize: 14,
    padding: '13px 16px',
  },
  menuItem__icon: {
    color: '#546E7A',
    marginRight: 10,
  },
  backToMeetups: {
    display: 'flex',
    alignItems: 'center',
    padding: '21px 16px',
  },
  backToMeetups__label: {
    color: '#607D8B',
    fontSize: 11,
    whiteSpace: 'nowrap',
  },
  backToMeetups__arrow: {
    color: '#546E7A',
    marginRight: 10,
    pointerEvents: 'none',
    transition: 'transform 0.2s',
  },
  backToMeetups__arrow_rotated: {
    transform: 'rotate(180deg)',
  },
  divider: {
    margin: '0 16px',
  },
  spacer: {
    flexGrow: 1,
  },
  menuReducer: {
    display: 'flex',
    padding: '26px 16px',
  },
  hider: {
    display: 'none',
  },
  centerer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Main = props => {
  const indexByPath = {
    visitor: 0,
    group: 0,
    settings: 0,
    desk: 1,
    'online-registration': 1,
    common: 2,
    'of-desks': 2,
    badge: 3,
    chat: 4,
  };
  const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

  const { children } = props;
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(indexByPath[path]);
  const { mid: meetupId } = useParams();
  const appContext = useContext(AppContext);
  const [menuReduced, setMenuReduced] = useState(localStorage.getItem('menuReduced') == 'true' ? true : false);
  const chatFeature = appContext.session.features.includes('chat');

  const handleMenuItemClick = (index, link) => {
    setSelectedIndex(index);
    // appContext.history.push(link)
  };

  const menuItems = [
    {
      title: 'Посетители',
      icon: <PersonOutlineIcon className={classes.menuItem__icon} />,
      link: `/m/${meetupId}/visitor`,
    },
    {
      title: 'Регистрация',
      icon: <BusinessIcon className={classes.menuItem__icon} />,
      link: `/m/${meetupId}/desk`,
    },
    {
      title: 'Статистика',
      icon: <EqualizerIcon className={classes.menuItem__icon} />,
      link: `/m/${meetupId}/stat/common`,
    },
    {
      title: 'Бейджи',
      icon: <FolderOutlinedIcon className={classes.menuItem__icon} />,
      link: `/m/${meetupId}/badge`,
    },
  ];

  if (chatFeature) {
    menuItems.push({
      title: 'Чаты',
      icon: <TextsmsIcon className={classes.menuItem__icon} />,
      link: `/m/${meetupId}/chat/channels`,
    });
  }

  return (
    <div
      className={clsx({
        [classes.root]: true,
      })}
    >
      <Topbar />
      <div className={classes.content}>
        <Route path='/m/:mid'>
          <Drawer
            anchor='left'
            variant='permanent'
            className={clsx({
              [classes.drawer]: true,
              [classes.drawer_reduced]: menuReduced,
            })}
            classes={{
              paper: classes.drawerPaper,
            }}
            tabIndex={-1}
          >
            <Button
              className={clsx({
                [classes.backToMeetups]: true,
              })}
              underline='none'
              href={window.location.origin + '/meetup'}
            >
              <KeyboardBackspaceIcon className={classes.backToMeetups__arrow} />
              <Typography
                className={clsx({
                  [classes.backToMeetups__label]: true,
                  [classes.hider]: menuReduced,
                })}
              >
                СПИСОК МЕРОПРИЯТИЙ
              </Typography>
            </Button>
            <Divider className={classes.divider} />
            <MenuList>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={item.title}
                  component={Link}
                  selected={index === selectedIndex}
                  onClick={() => handleMenuItemClick(index, item.link)}
                  className={classes.menuItem}
                  tabIndex={0}
                  to={item.link}
                >
                  {item.icon}
                  <Typography
                    className={clsx({
                      [classes.hider]: menuReduced,
                    })}
                  >
                    {item.title}
                  </Typography>
                </MenuItem>
              ))}
            </MenuList>
            <div className={classes.spacer}></div>

            <Button
              style={{
                background: 'inherit',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                padding: 16,
                justifyContent: 'start',
              }}
              onClick={() => {
                localStorage.setItem('menuReduced', !menuReduced);
                setMenuReduced(!menuReduced);
              }}
            >
              <KeyboardBackspaceIcon
                className={clsx({
                  [classes.backToMeetups__arrow]: true,
                  [classes.backToMeetups__arrow_rotated]: menuReduced,
                })}
              />
              <Typography
                className={clsx({
                  [classes.backToMeetups__label]: true,
                  [classes.hider]: menuReduced,
                })}
              >
                СВЕРНУТЬ МЕНЮ
              </Typography>
            </Button>
          </Drawer>
        </Route>
        <main className={classes.main}>
          <div className={classes.main__container}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
