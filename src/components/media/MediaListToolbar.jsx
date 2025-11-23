import React, { useMemo } from 'react';
import { Box, Button, TextField, InputAdornment, SvgIcon, Tooltip } from '@mui/material';
import { Search as SearchIcon, Trash2 as Trash2Icon } from 'react-feather';

const MediaListToolbar = ({ media = [], onClick, selectedItems = [], query = '', onQueryChange = () => {} }) => {
  useMemo(() => {}, [media]);

  const hasSelection = Array.isArray(selectedItems) && selectedItems.length > 0;

  return (
    // center content and align with MediaGrid max width and padding so search lines up
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1100, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            {/* left: compact search matching MediaList style */}
            <TextField
              size="small"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search Media"
              sx={{ width: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              aria-label="Search media (quick)"
            />

            {/* right: action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              { !hasSelection ? (
                <Tooltip title="Select media to delete" arrow>
                  <span>
                    <Button
                      sx={{
                        cursor: 'pointer',
                        color: 'black',
                        borderColor: 'error.main',
                        '&:hover': { backgroundColor: 'rgba(211,47,47,0.08)' },
                        '& .MuiSvgIcon-root': { color: 'error.main' }
                      }}
                      onClick={onClick}
                      disabled={!Array.isArray(selectedItems) || selectedItems.length === 0}
                      variant="outlined"
                      color="error"
                      type="button"
                      aria-label="Delete selected media"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <Trash2Icon />
                        </SvgIcon>
                      }
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  sx={{
                    cursor: 'pointer',
                    color: 'black',
                    borderColor: 'error.main',
                    '&:hover': { backgroundColor: 'rgba(211,47,47,0.08)' },
                    '& .MuiSvgIcon-root': { color: 'error.main' }
                  }}
                  onClick={onClick}
                  disabled={!Array.isArray(selectedItems) || selectedItems.length === 0}
                  variant="outlined"
                  color="error"
                  type="button"
                  aria-label="Delete selected media"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <Trash2Icon />
                    </SvgIcon>
                  }
                >
                  Delete
                </Button>
              )}
              <Button color="primary" variant="contained" href="savemedia" size="medium">Add Media</Button>
              <Button color="primary" variant="contained" href="createmedia" size="medium">Create Media</Button>
              <Button color="primary" variant="contained" href="splitmedia" size="medium">Create Split Screen</Button>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default MediaListToolbar;
