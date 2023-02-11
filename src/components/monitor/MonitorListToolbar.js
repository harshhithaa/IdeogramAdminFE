/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Typography,
  Snackbar,
  Alert
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Search as SearchIcon, Trash2 as Trash2Icon } from 'react-feather';
import { connect } from 'react-redux';
import { updateAllMonitors } from '../../store/action/user';

const MonitorListToolbar = (props) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // console.log(props.monitorList);

  useEffect(() => {}, []);

  const monitorRefs = props.monitorList?.map((item) => item.MonitorRef);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handlePushToAll = () => {
    const data = {
      MonitorList: monitorRefs,
      PlaylistRef: selectedPlaylist
    };

    props.updateAllMonitors(data, (callback) => {
      if (!callback.Error) {
        window.location.reload();
      } else {
      }
    });
  };

  return (
    <Box {...props}>
      <Snackbar
        open={openSnackbar}
        key={'top'}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
      >
        <Alert onClose={handleCloseSnackBar} severity="error">
          Something Went Wrong, Please Try Again
        </Alert>
      </Snackbar>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Box sx={{ maxWidth: 700 }}>
                <TextField
                  fullWidth
                  onChange={(e) => props.onsearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search Monitor"
                  variant="outlined"
                />
              </Box>
              <Box display={'flex'} direction="row" gap={2}>
                <Stack
                  direction="row"
                  style={{ alignItems: 'center' }}
                  spacing={2}
                >
                  <Typography>Select Playlist:</Typography>
                  <Select
                    labelId="select-playlist"
                    id="select-playlist"
                    value={selectedPlaylist}
                    label="Select Playlist"
                    onChange={(e) => {
                      console.log('e.target.value', e.target.value);
                      setSelectedPlaylist(e.target.value);
                    }}
                    autoWidth
                  >
                    {props.playlistList?.map((playlist) => (
                      <MenuItem value={playlist.PlaylistRef}>
                        {playlist.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <Button
                  onClick={handlePushToAll}
                  color="primary"
                  variant="contained"
                  disabled={selectedPlaylist == ''}
                >
                  Push To All Monitors
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateAllMonitors: (data, callback) =>
    dispatch(updateAllMonitors(data, callback))
});

export default connect(null, mapDispatchToProps)(MonitorListToolbar);
