import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ImageUpload from './screens/upload';
import Header from './components/Header';

const styles = {
  root: {
    flexGrow: 1
  },
  title: {
    paddingTop: "15"
  }
};

const App = ({ classes }) => {
  return (
    <>
    <Header/>
   <ImageUpload />
  </>
  )
}


export default withStyles(styles)(App);
