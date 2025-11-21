/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon
} from '@mui/material';
import { Search as SearchIcon, Trash2 as Trash2Icon } from 'react-feather';
import { useNavigate } from 'react-router';

const PlaylistToolbar = (props) => {
  const navigate = useNavigate();
  return (
    <Box {...props}>
      {console.log('props in pl toolbar', props)}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          alignItems: 'center'
        }}
      >
        {/* DELETE button styled/behaves like Media page:
            - contained, error color
            - uses startIcon for neat icon+text alignment
            - disabled when nothing selected
            - calls props.onclick() on click */}
        <Button
          sx={{ mx: 1 }}
          color="error"
          variant="contained"
          startIcon={
            <SvgIcon fontSize="small" sx={{ color: 'white' }}>
              <Trash2Icon />
            </SvgIcon>
          }
          onClick={() => props.onclick()}
          disabled={!props.selectedPlaylist || props.selectedPlaylist.length === 0}
          aria-label="Delete selected playlists"
        >
          Delete
        </Button>

        <Button
          color="primary"
          variant="contained"
          href="createplaylist"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Add Playlist
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
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
                placeholder="Search Playlist"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PlaylistToolbar;
