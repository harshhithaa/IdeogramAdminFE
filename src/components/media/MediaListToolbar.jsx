import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Search as SearchIcon } from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';

const MediaListToolbar = ({ media = [], onClick, selectedItems = [], query = '', onQueryChange = () => {} }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2
        }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate('/app/savemedia')}
          size="medium"
        >
          Add Media
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search media"
                  variant="outlined"
                  value={query || ''}
                  onChange={(e) => onQueryChange(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Media Type</InputLabel>
                  <Select
                    value={mediaTypeFilter}
                    label="Media Type"
                    onChange={(e) => onMediaTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="image">Images</MenuItem>
                    <MenuItem value="video">Videos</MenuItem>
                    <MenuItem value="gif">GIFs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={activeStatusFilter}
                    label="Status"
                    onChange={(e) => onActiveStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="1">Active</MenuItem>
                    <MenuItem value="0">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  color="error"
                  variant="contained"
                  disabled={!selectedItems || selectedItems.length === 0}
                  onClick={onClick}
                >
                  Delete ({selectedItems?.length || 0})
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

MediaListToolbar.propTypes = {
  media: PropTypes.array,
  selectedItems: PropTypes.array,
  onClick: PropTypes.func,
  query: PropTypes.string,
  onQueryChange: PropTypes.func,
  onMediaTypeFilter: PropTypes.func,
  onActiveStatusFilter: PropTypes.func,
  mediaTypeFilter: PropTypes.string,
  activeStatusFilter: PropTypes.string
};

export default MediaListToolbar;
