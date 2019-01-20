import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Input from '@material-ui/core/Input';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import {endpoint, cloudFrontEndPoint} from './constants';

const dimensions = [{
    name: 'Horizontal',
    length: '755',
    width: '450'
},{
  name: 'Vertical',
  length: '365',
  width: '450'
},
{
  name: 'Horizontal Small',
  length: '365',
  width: '212'
},{
    name: 'Gallery',
    length: '380',
    width: '380'
}];
const styles = theme => ({
    card: {
           
    },
    input: {
        display: 'none'
    },
  fab: {
       margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  progress: {
       margin: theme.spacing.unit * 2,
        marginTop: "20%",
          marginLeft: "50%",
       [theme.breakpoints.down('xs')]:{
              marginTop: "50%",
       marginLeft: "45%",
       }
  }
});

const ErrorMessage = ({open, handleClose}) => {

 return  (   <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Please enter the recommended size 1028x1028</span>}
      />
)};

const ImageUpload = ( { classes}) => {

    const [loader, setLoader] = useState(false);
    const [showList, setShowList ] = useState(false);
    const [filename, setFilename] = useState(null);
    const [ open, setOpen ] = useState(false);

    const handleUpload = (event) => {
      
      if(!event.target.files)return ;
        const  reader = new FileReader();

//Read the contents of Image File.
      const file  = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function (e) {

      //Initiate the JavaScript Image object.
      const  image = new Image();

      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;

      //Validate the File Height and Width.
      image.onload = function () {
        var height = this.height;
        var width = this.width;
          if(height !== 1028 || width !== 1028){
            setOpen(true);
            return ;
          }
            setLoader(true);
        setShowList(false);
        const data = new FormData();
    data.append('file',  file, file.name);

    axios
      .post(endpoint, data)
      .then(({ data: {fileName}})=> {
        setFilename(fileName);
        setShowList(true);
        setLoader(false);
      })
      .catch(error => setLoader(false));

      };

      }
      
    };
    return (
        <>
       { ( showList&& <List component="nav" className={classes.root}>
        {
          dimensions.map(d => (
            <>
            <ListItem key={d.name} button>
             <ListItemText>
             {d.name}&nbsp;({d.length}&nbsp;x&nbsp;{d.width})
             </ListItemText>
             <a target="_blank" href={`${cloudFrontEndPoint}/${d.length}x${d.width}/${filename}`}><IconButton><OpenInNewIcon color="primary" /></IconButton></a>
            </ListItem>
            <Divider/>
            </>
          ))
        }
      </List>)
      }
               {loader && <CircularProgress className={classes.progress} />}
        <Input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="contained-button-file">
        <Fab  component="span" color="primary" aria-label="Add" className={classes.fab}>
        <AddIcon/>
        </Fab>
      </label>
         <ErrorMessage
        open={open}
        handleClose={() => setOpen(false)}
       />
      </>
    );
}

export default withStyles(styles)(ImageUpload);