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

const PlaylistToolbar = (props) => {
  const navigate = useNavigate();
  const hasSelection = Array.isArray(props.selectedPlaylist) && props.selectedPlaylist.length > 0;

  // Use a single flex row for search + actions, matching grid padding
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
          placeholder="Search Playlist"
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
          aria-label="Search playlist"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!hasSelection ? (
            <Tooltip title="Select a playlist to delete" arrow>
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
                  disabled={!props.selectedPlaylist || props.selectedPlaylist.length === 0}
                  variant="outlined"
                  color="error"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <Trash2Icon />
                    </SvgIcon>
                  }
                  aria-label="Delete selected playlists"
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
              disabled={!props.selectedPlaylist || props.selectedPlaylist.length === 0}
              variant="outlined"
              color="error"
              startIcon={
                <SvgIcon fontSize="small">
                  <Trash2Icon />
                </SvgIcon>
              }
              aria-label="Delete selected playlists"
            >
              Delete
            </Button>
          )}

          <Button
            color="primary"
            variant="contained"
            href="createplaylist"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Add Playlist
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaylistToolbar;
