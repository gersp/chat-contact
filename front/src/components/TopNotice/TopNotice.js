import React, { useContext } from 'react';
import { Link, Typography } from '@material-ui/core';
import { AppContext } from '../../AppContext';

const TopNotice = props => {
  const { message, text, level, removable, onRemove } = props;
  const appContext = useContext(AppContext);

  const sessionId = localStorage.getItem('sessionId');

  const redirect = path => {
    if (!path) {
      const hosts = ['eventos42.ru', 'eventos42.online'];
      for (let i = 0; i < hosts.length; i++) {
        if (window.location.hostname !== hosts[i]) {
          window.location = 'https://' + hosts[i] + window.location.pathname + '?session=' + sessionId;
          break;
        }
      }
    }
    window.location.href = path;
  };

  console.log('TopNotice::render ' + message);
  // Сначала проверим что message - это одно из встроенных сообщений
  if (message === 'connectionError') {
    return (
      <div className={`rastjazka rastjazka-error`}>
        <Typography style={{ display: 'inline' }} variant={'h4'} color={'inherit'}>
          Сервер недоступен.
          {/*Перейдите на резервный*/}
          {/*&nbsp;*/}
          {/*<Link*/}
          {/*  color="inherit"*/}
          {/*  underline="always"*/}
          {/*  onClick={redirect}*/}
          {/*  style={{cursor:"pointer"}}*/}
          {/*>*/}
          {/*  сайт*/}
          {/*</Link>*/}.
        </Typography>
      </div>
    );
  } else if (message === 'deskUpdated') {
    return (
      <div className={'rastjazka rastjazka-warn'}>
        <Typography style={{ display: 'inline' }} variant={'h4'} color={'inherit'}>
          Стойка обновлена. Для применения изменений &nbsp;
          <Link
            color='inherit'
            underline='always'
            onClick={() => window.location.reload(true)}
            style={{ cursor: 'pointer' }}
          >
            обновите страницу
          </Link>
          .
        </Typography>
      </div>
    );
  } else if (message === 'sessionExpired') {
    return (
      <div className={`rastjazka rastjazka-error`}>
        <Typography style={{ display: 'inline' }} variant={'h4'} color={'inherit'}>
          Время сессии истекло, требуется &nbsp;
          <Link color='inherit' underline='always' onClick={() => redirect('/sign-in')} style={{ cursor: 'pointer' }}>
            аутентификация
          </Link>
          .
        </Typography>
      </div>
    );
  } else {
    return (
      <div className={'rastjazka rastjazka-' + level}>
        <Typography style={{ display: 'inline' }} variant={'h4'} color={'inherit'}>
          {text}
        </Typography>
        {removable && (
          <Link color='inherit' underline='always' onClick={onRemove} style={{ cursor: 'pointer' }}>
            (Закрыть)
          </Link>
        )}
      </div>
    );
  }
};

export default TopNotice;
