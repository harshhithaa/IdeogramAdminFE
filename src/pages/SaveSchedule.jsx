/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-sequences */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveSchedule } from '../store/action/user';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';

const SaveScheduleDetails = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const theme = useTheme();

  const [playlistData, setPlaylistData] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(
    (state && state.PlaylistRef) || ''
  );
  const [title, setTitle] = useState((state && state.Title) || '');
  const [description, setDescription] = useState((state && state.Description) || '');
  const [startDate, setStartDate] = useState((state && state.StartDate) || '');
  const [endDate, setEndDate] = useState((state && state.EndDate) || '');
  const [startTime, setStartTime] = useState(
    (state && state.StartTime && state.StartTime.slice(0, 5)) || ''
  );
  const [endTime, setEndTime] = useState(
    (state && state.EndTime && state.EndTime.slice(0, 5)) || ''
  );
  const [fixedTimePlayback, setFixedTimePlayback] = useState(
    (state && state.FixedTimePlayback) || false
  );
  const [loading, setLoading] = useState(false);

  // Days state (defaults kept unchecked now)
  const [days, setDays] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false
  });

  useEffect(() => {
    if (props.playlists && Array.isArray(props.playlists)) {
      setPlaylistData(props.playlists);
    }
  }, [props.playlists]);

  const daysKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const selectedDaysArray = daysKeys.filter((k) => days[k]);

  const handleDaysToggle = (event, newSelected) => {
    const next = {};
    daysKeys.forEach((k) => {
      next[k] = Array.isArray(newSelected) ? newSelected.includes(k) : false;
    });
    setDays(next);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    setLoading(true);
    const selectedDays = Object.keys(days).filter((k) => days[k]);

    const payload = {
      Title: title,
      Description: description,
      PlaylistRef: selectedPlaylist || null,
      StartDate: startDate || null,
      EndDate: endDate || null,
      StartTime: startTime || null,
      EndTime: endTime || null,
      FixedTimePlayback: fixedTimePlayback,
      Days: selectedDays
    };

    props.saveSchedule(payload, (err) => {
      setLoading(false);
      if (!err) navigate('/app/schedules');
      else console.error('saveSchedule error', err);
    });
  };

  // common label styling to make labels slightly larger and darker
  const labelSx = {
    fontSize: '1.05rem',            // increased from 0.98rem
    color: theme.palette.text.primary,
    fontWeight: 700                 // made slightly darker/bolder
  };

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 3, md: 6 }, // increase side padding to add white space
        py: 4,
        minHeight: '80vh',
        boxSizing: 'border-box'
      }}
    >
      {/* reduced maxWidth so inputs are shorter and leave white space on both sides */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', width: '100%' }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight={700}
          fontSize={28}                    // slightly larger page header
          sx={{ mb: { xs: 4, md: 6 } }} // extra spacing below header
        >
          Create Schedule
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Row 1 — Title & Description */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                size="medium"
                InputLabelProps={{ sx: labelSx }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                size="medium"
                InputLabelProps={{ sx: labelSx }}
              />
            </Grid>

            {/* Row 2 — Start Date & End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true, sx: labelSx }}
                size="medium"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true, sx: labelSx }}
                size="medium"
              />
            </Grid>

            {/* Row 3 — Start Time & End Time */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true, sx: labelSx }}
                size="medium"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true, sx: labelSx }}
                size="medium"
              />
            </Grid>

            {/* Row 4 — Playlist & Fixed Time Playback */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="medium">
                <InputLabel id="playlist-label" shrink sx={labelSx}>
                  Playlist
                </InputLabel>
                <Select
                  labelId="playlist-label"
                  id="playlist-select"
                  value={selectedPlaylist}
                  label="Playlist"
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {playlistData.map((p) => (
                    <MenuItem
                      key={p.PlaylistRef || p.id || p.PlaylistId || p.Ref}
                      value={p.PlaylistRef || p.id || p.PlaylistId || p.Ref}
                    >
                      {p.Name || p.playlistName || p.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl fullWidth size="medium">
                <InputLabel id="fixed-label" shrink sx={labelSx}>
                  Fixed Time Playback
                </InputLabel>
                <Select
                  labelId="fixed-label"
                  id="fixed-select"
                  value={fixedTimePlayback ? 'yes' : 'no'}
                  label="Fixed Time Playback"
                  onChange={(e) => setFixedTimePlayback(e.target.value === 'yes')}
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Days — centered heading + single-row toggle buttons */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                align="center"
                gutterBottom
                sx={{ fontWeight: 700, fontSize: '1.05rem' }} // larger & darker "Days" label
              >
                Days
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  px: 1,
                  overflowX: { xs: 'auto', md: 'hidden' }
                }}
              >
                <ToggleButtonGroup
                  value={selectedDaysArray}
                  onChange={handleDaysToggle}
                  aria-label="days"
                  size="small"
                  sx={{
                    flexWrap: 'nowrap',
                    gap: 1,
                    '& .MuiToggleButton-root': {
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      minWidth: 92,
                      fontSize: '0.98rem'           // slightly larger button text
                    },
                    '& .MuiToggleButton-root.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark
                      }
                    }
                  }}
                >
                  <ToggleButton value="sunday" aria-label="Sunday">Sunday</ToggleButton>
                  <ToggleButton value="monday" aria-label="Monday">Monday</ToggleButton>
                  <ToggleButton value="tuesday" aria-label="Tuesday">Tuesday</ToggleButton>
                  <ToggleButton value="wednesday" aria-label="Wednesday">Wednesday</ToggleButton>
                  <ToggleButton value="thursday" aria-label="Thursday">Thursday</ToggleButton>
                  <ToggleButton value="friday" aria-label="Friday">Friday</ToggleButton>
                  <ToggleButton value="saturday" aria-label="Saturday">Saturday</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  mt: 4
                }}
              >
                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ root = {} }) => ({
  root
});

const mapDispatchToProps = (dispatch) => ({
  saveSchedule: (data, callback) => dispatch(saveSchedule(data, callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveScheduleDetails);
