import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = createMuiTheme({
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
  topLogo: '/images/poly/polytech_logo_sm.svg',
  topIcon: '/images/poly/favicon.ico',
  appBarColor: 'secondary',
  documentTitle: 'PolyReg',
  registrationAvailable: false,
  topLogoWidth: 170
});

export default theme;
