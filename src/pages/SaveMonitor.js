/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-sequences */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  Container,
  TextField,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormControl,
  ListSubheader
} from '@material-ui/core';
import { COMPONENTS } from 'src/utils/constant';
import { getUserComponentList, saveMonitor } from '../store/action/user';
import { Alert, Stack } from '@mui/material';
import { X as CloseIcon, Plus } from 'react-feather';
import Chip from '@material-ui/core/Chip';
import { IsValuePresentInArray } from 'src/utils/helperFunctions';
import { CancelRounded } from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';

const SaveMonitorDetails = (props) => {
  const { component } = props || null;
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log('state', state);

  const [MonitorRef, setMonitorRef] = useState(
    (state && state.MonitorRef) || ''
  );
  const [playlist, setPlaylist] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [title, setTitle] = useState((state && state.MonitorName) || '');
  const [description, setDescription] = useState(
    (state && state.Description) || ''
  );
  const [playlistData, setPlaylistData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(
    (state && state.PlaylistRef) || ''
  );
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [deletedSchedules, setDeletedSchedules] = useState([]);
  const [updatedSchedules, setUpdatedSchedules] = useState([]);
  const [loader, setloader] = useState(true);
  const [scheduleloader, setScheduleloader] = useState(true);
  const [orientation, setOrientation] = useState(
    (state && state.Orientation === '90' ? 'Landscape' : 'Portrait') || ''
  );
  const [slideTime, setSlideTime] = useState((state && state.SlideTime) || '');
  const [type, settype] = useState(
    state && state.type === 'View'
      ? 'View'
      : state && state.type === 'Edit'
      ? 'Update'
      : 'Create'
  );
  let [box, setbox] = useState(false);
  let [boxMessage, setboxMessage] = useState('');
  let [color, setcolor] = useState('success');
  const [checked, setChecked] = useState(false);
  // const [disable, setDisable] = useState([]);
  let days = (state && state.Days && state.Days.split(',')) || [];
  const orientations = ['Portrait', 'Landscape'];
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const min = 5;
  const max = 60;
  const step = 5;

  useEffect(() => {
    const data = {
      componenttype: COMPONENTS.Playlist
    };
    const dataForSchedule = {
      componenttype: COMPONENTS.Schedule
    };

    console.log('outside', data);
    props.getUserComponentList(data, (err) => {
      console.log('data', data);
      console.log('err', err);
      if (err.exists) {
        console.log('err.errmessage', err.errmessage);
      } else {
        console.log('props', props, 'component', component);
        setPlaylist(component.playlistList);
        setloader(false);
        console.log('playlist', playlist);
      }
    });
    setPlaylistData(playlist);

    props.getUserComponentList(dataForSchedule, (err) => {
      console.log('data', dataForSchedule);
      console.log('err', err);
      if (err.exists) {
        console.log('err.errmessage', err.errmessage);
      } else {
        console.log('props', props, 'component', component);
        setSchedule(component.scheduleList);
        setScheduleloader(false);
        console.log('schedule', schedule);
      }
    });

    setScheduleData(schedule);
    const prevList = [];

    state &&
      state.Schedules &&
      state.Schedules.map((item) => {
        if (item.IsActive === 1) {
          prevList.push(item);
        }
      });

    setSelectedSchedule(prevList);
    console.log('prevList', prevList);
  }, [loader, scheduleloader]);

  // const saveData = () => {
  //   console.log(selectedSchedule);
  //   console.log(deletedSchedules);
  //   // saveMonitorData();
  // };

  function saveMonitorData() {
    const selectedSchedules = selectedSchedule.map((item) => ({
      ScheduleRef: item.ScheduleRef,
      IsActive: item.IsActive
    }));

    const saveMonitorDetails = {
      MonitorName: title,
      Description: description,
      DefaultPlaylistRef: selectedPlaylist,
      Schedules: [...selectedSchedules, ...deletedSchedules],
      IsActive: 1,
      Orientation: orientation === 'Landscape' ? '90' : '0',
      SlideTime: slideTime
    };
    if (MonitorRef !== '') saveMonitorDetails.MonitorRef = MonitorRef;

    console.log('saveMonitorDetails Request', saveMonitorDetails);

    // setDisable(true);
    props.saveMonitor(saveMonitorDetails, (err) => {
      if (err.exists) {
        window.scrollTo(0, 0);
        setcolor('error');
        setboxMessage(err.err);
        setbox(true);
      } else {
        navigate('/app/monitors', { replace: true });
      }
    });
  }

  const handleChange = (e) => {
    console.log('Schedule Changed', e.target.value);
    setSelectedSchedule(e.target.value);
    let deletedarr = [];
    e.target.value.map((item) => {
      if (
        IsValuePresentInArray(deletedSchedules, 'ScheduleRef', item.ScheduleRef)
      ) {
        deletedarr = deletedSchedules.filter(
          (deletedSchedule) => deletedSchedule.IsActive === item.IsActive
        );
      }
    });
    setDeletedSchedules(deletedarr);
  };

  const handleRemoveSchedule = (e, value) => {
    if (
      !IsValuePresentInArray(deletedSchedules, 'ScheduleRef', value.ScheduleRef)
    ) {
      deletedSchedules.push({ ScheduleRef: value.ScheduleRef, IsActive: 0 });
      console.log('Removed schedule', deletedSchedules);
    }
    setSelectedSchedule(
      selectedSchedule.filter((item) => item.ScheduleRef !== value.ScheduleRef)
    );
  };

  const handleDateAndTime = () => {
    let isClashing;

    for (let i = 0; i < selectedSchedule.length; i++) {
      for (let j = i + 1; j < selectedSchedule.length; j++) {
        if (selectedSchedule[i].StartTime < selectedSchedule[j].StartTime) {
          if (selectedSchedule[i].EndTime < selectedSchedule[j].StartTime) {
            console.log('Pass 1', selectedSchedule[i], selectedSchedule[j]);
            // saveMonitorData();
          } else {
            if (selectedSchedule[i].StartDate < selectedSchedule[j].StartDate) {
              if (selectedSchedule[i].EndDate < selectedSchedule[j].StartDate) {
                console.log('Pass 2', selectedSchedule[i], selectedSchedule[j]);
                // saveMonitorData();
              } else {
                // setOpenSnackbar(true);
                isClashing = true;
                console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
              }
            } else if (
              selectedSchedule[i].StartDate > selectedSchedule[j].StartDate
            ) {
              if (selectedSchedule[i].StartDate > selectedSchedule[j].EndDate) {
                console.log('Pass 3', selectedSchedule[i], selectedSchedule[j]);
                // saveMonitorData();
              } else {
                // setOpenSnackbar(true);
                isClashing = true;
                console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
              }
            } else if (
              selectedSchedule[i].StartDate === selectedSchedule[j].StartDate
            ) {
              isClashing = true;
              console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
            }
          }
        } else if (
          selectedSchedule[i].StartTime > selectedSchedule[j].StartTime
        ) {
          if (selectedSchedule[i].StartTime > selectedSchedule[j].EndTime) {
            console.log('Pass 4', selectedSchedule[i], selectedSchedule[j]);
            // saveMonitorData();
          } else {
            if (selectedSchedule[i].StartDate < selectedSchedule[j].StartDate) {
              if (selectedSchedule[i].EndDate < selectedSchedule[j].StartDate) {
                console.log('Pass 5', selectedSchedule[i], selectedSchedule[j]);
                // saveMonitorData();
              } else {
                // setOpenSnackbar(true);
                isClashing = true;
                console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
              }
            } else if (
              selectedSchedule[i].StartDate > selectedSchedule[j].StartDate
            ) {
              if (selectedSchedule[i].StartDate > selectedSchedule[j].EndDate) {
                console.log('Pass 6', selectedSchedule[i], selectedSchedule[j]);
                // saveMonitorData();
              } else {
                // setOpenSnackbar(true);
                isClashing = true;
                console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
              }
            }
          }
        } else if (
          selectedSchedule[i].StartTime === selectedSchedule[j].StartTime
        ) {
          if (selectedSchedule[i].StartDate < selectedSchedule[j].StartDate) {
            if (selectedSchedule[i].EndDate < selectedSchedule[j].StartDate) {
              console.log('Pass 7', selectedSchedule[i], selectedSchedule[j]);
              // saveMonitorData();
            } else {
              // setOpenSnackbar(true);
              isClashing = true;
              console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
            }
          } else if (
            selectedSchedule[i].StartDate > selectedSchedule[j].StartDate
          ) {
            if (selectedSchedule[i].StartDate > selectedSchedule[j].EndDate) {
              console.log('Pass 8', selectedSchedule[i], selectedSchedule[j]);
              // saveMonitorData();
            } else {
              // setOpenSnackbar(true);
              isClashing = true;
              console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
            }
          } else if (
            selectedSchedule[i].StartDate === selectedSchedule[j].StartDate
          ) {
            isClashing = true;
            console.log('Clash', selectedSchedule[i], selectedSchedule[j]);
          }
        }
      }
    }

    if (isClashing) {
      setOpenSnackbar(true);
    } else {
      saveMonitorData();
    }
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Helmet>
        <title>Schedule | Ideogram</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'block',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Snackbar
          open={openSnackbar}
          key={'top'}
          autoHideDuration={5000}
          onClose={handleCloseSnackBar}
        >
          <Alert onClose={handleCloseSnackBar} severity="error">
            Some Schedules are Clashing
          </Alert>
        </Snackbar>
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              title: '',
              description: '',
              playlist: '',
              startTime: '',
              endTime: '',
              startDate: '',
              endDate: '',
              fixedTimePlayback: false,
              days: []
            }}
            onSubmit={() => {
              navigate('/app/monitors', { replace: true });
            }}
          >
            {({ errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    {type} Monitor
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label="Title"
                  margin="normal"
                  name="title"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  value={title}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.description && errors.description)}
                  fullWidth
                  helperText={touched.description && errors.description}
                  label="Description"
                  margin="normal"
                  name="description"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  value={description}
                  variant="outlined"
                />
                <InputLabel id="select-playlist">Default Playlist</InputLabel>
                <Select
                  labelId="select-playlist"
                  id="select-playlist"
                  value={selectedPlaylist}
                  label="playlist"
                  onChange={(e) => {
                    console.log('e.target.value', e.target.value);
                    setSelectedPlaylist(e.target.value);
                  }}
                >
                  {playlistData && playlistData.length > 0 ? (
                    playlistData.map((item) => (
                      <MenuItem value={item.PlaylistRef}>
                        {`${item.Name}`}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>{'No Items available'}</MenuItem>
                  )}
                </Select>
                <Box>
                  <InputLabel id="select-schedule">Schedule</InputLabel>
                  <Select
                    labelId="select-schedule"
                    id="select-schedule"
                    multiple
                    value={selectedSchedule}
                    label="schedule"
                    renderValue={(selected) => (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {selected.map((value, index) => (
                          <Chip
                            key={index}
                            label={value.Title}
                            style={{ margin: 2 }}
                            clickable
                            onDelete={(e) => handleRemoveSchedule(e, value)}
                            deleteIcon={
                              <CancelRounded
                                onMouseDown={(event) => event.stopPropagation()}
                              />
                            }
                          />
                        ))}
                      </div>
                    )}
                    onChange={handleChange}
                  >
                    {scheduleData && scheduleData.length > 0 ? (
                      scheduleData.map((item) => {
                        if (
                          !IsValuePresentInArray(
                            selectedSchedule,
                            'ScheduleRef',
                            item.ScheduleRef
                          )
                        ) {
                          return (
                            <MenuItem value={item}>{`${item.Title}`}</MenuItem>
                          );
                        }
                      })
                    ) : (
                      <MenuItem>No Items available</MenuItem>
                    )}
                  </Select>
                </Box>
                <InputLabel id="select-orientation">
                  Select Orientation
                </InputLabel>
                <Select
                  labelId="select-orientation"
                  id="select-orientation"
                  value={orientation}
                  label="orientation"
                  onChange={(e) => {
                    console.log('e.target.value', e.target.value);
                    setOrientation(e.target.value);
                  }}
                >
                  {orientations.map((value) => (
                    <MenuItem value={value}>{value}</MenuItem>
                  ))}
                </Select>
                <InputLabel id="select-slide-interval">
                  Select Slide Interval (in seconds)
                </InputLabel>
                <TextField
                  type="number"
                  id="select-slide-interval"
                  value={slideTime}
                  inputProps={{ min, max, step }}
                  onChange={(e) => {
                    setSlideTime(e.target.value);
                  }}
                />
                {box ? (
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity={color}>{boxMessage}</Alert>
                  </Stack>
                ) : null}

                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    // type="submit"
                    variant="contained"
                    onClick={() => {
                      handleDateAndTime();
                    }}
                    disabled={slideTime < 5 || slideTime > 60}
                  >
                    {type} Monitor
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

const mapStateToProps = ({ root = {} }) => {
  const component = root.user.components;

  return {
    component
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserComponentList: (data, callback) =>
    dispatch(getUserComponentList(data, callback)),
  saveMonitor: (data, callback) => dispatch(saveMonitor(data, callback))
});
export default connect(mapStateToProps, mapDispatchToProps)(SaveMonitorDetails);
