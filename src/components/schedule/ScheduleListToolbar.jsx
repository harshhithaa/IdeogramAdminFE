/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  SvgIcon,
  Tooltip
} from '@mui/material';
import { Search as SearchIcon, Trash2 as Trash2Icon } from 'react-feather';

const ScheduleListToolbar = (props) => {
  const navigate = useNavigate();
  const hasSelection = Array.isArray(props.selectedSchedules) && props.selectedSchedules.length > 0;

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '100%',
        pr: 1,
        mt: 2,
        mb: 1
      }}>
        <TextField
          size="small"
          value={props.search || ''}
          onChange={(e) => props.onsearch(e.target.value)}
          placeholder="Search Schedule"
          sx={{ width: 220, bgcolor: 'transparent', mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          variant="outlined"
          aria-label="Search schedule"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!hasSelection ? (
            <Tooltip title="Select schedule(s) to delete" arrow>
              <span>
                <Button
                  sx={{
                    mx: 1,
                    cursor: 'pointer',
                    color: 'black',
                    borderColor: 'error.main',
                    '&:hover': { backgroundColor: 'rgba(211,47,47,0.08)' },
                    '& .MuiSvgIcon-root': { color: 'error.main' }
                  }}
                  onClick={() => props.onclick()}
                  disabled={props.selectedSchedules.length === 0}
                  variant="outlined"
                  color="error"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <Trash2Icon />
                    </SvgIcon>
                  }
                  aria-label="Delete selected schedules"
                >
                  Delete
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button
              sx={{
                mx: 1,
                cursor: 'pointer',
                color: 'black',
                borderColor: 'error.main',
                '&:hover': { backgroundColor: 'rgba(211,47,47,0.08)' },
                '& .MuiSvgIcon-root': { color: 'error.main' }
              }}
              onClick={() => props.onclick()}
              disabled={props.selectedSchedules.length === 0}
              variant="outlined"
              color="error"
              startIcon={
                <SvgIcon fontSize="small">
                  <Trash2Icon />
                </SvgIcon>
              }
              aria-label="Delete selected schedules"
            >
              Delete
            </Button>
          )}

          <Button color="primary" variant="contained" href="saveschedule">
            Add Schedule
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleListToolbar;
