/* Replace the previous Grid of small widgets with a responsive 2x2 card grid.
   Cards order updated to: Media, Playlist, Schedule, Monitors.
*/
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, useTheme } from '@mui/material';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import { useNavigate } from 'react-router-dom';

const cardConfig = [
  { id: 'media', title: 'Media', to: '/app/media', Icon: PermMediaIcon, color: 'success' },
  { id: 'playlist', title: 'Playlist', to: '/app/playlists', Icon: PlaylistPlayIcon, color: 'warning' },
  { id: 'schedule', title: 'Schedule', to: '/app/schedules', Icon: CalendarTodayIcon, color: 'secondary' },
  { id: 'monitors', title: 'Monitors', to: '/app/monitors', Icon: DesktopWindowsIcon, color: 'primary' }
];

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleKey = (e, to) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <>
      <Helmet>
        <title>Overview | Ideogram</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          pt: { xs: 3, md: 4 },
          pb: { xs: 3, md: 4 },
          px: { xs: 2, md: 4 }
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography variant="h4" sx={{ mb: { xs: 2, md: 3 }, fontWeight: 600 }}>
            Dashboard Overview
          </Typography>

          <Box
            component="section"
            aria-label="Primary dashboard navigation"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 2.5, md: 3 },
              height: { xs: 'auto', md: `calc(100vh - 120px)` },
              alignItems: 'stretch'
            }}
          >
            {cardConfig.map((c) => {
              const Icon = c.Icon;
              return (
                <Box
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.title} page`}
                  onClick={() => navigate(c.to)}
                  onKeyDown={(e) => handleKey(e, c.to)}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: { xs: 3, md: 4 },
                    cursor: 'pointer',
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.02)',
                      boxShadow: theme.shadows[8]
                    },
                    '&:active': {
                      transform: 'translateY(-2px) scale(0.995)'
                    },
                    '&:focus': {
                      outline: `3px solid ${theme.palette.primary.light}`,
                      outlineOffset: '4px'
                    },
                    height: { xs: 'auto', md: '100%' },
                    minHeight: 160,
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Box
                    sx={{
                      width: 64,                 // slightly smaller icon container
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      bgcolor: `${c.color}.main`,
                      color: 'common.white',
                      boxShadow: theme.shadows[3]
                    }}
                    aria-hidden
                  >
                    <Icon sx={{ fontSize: 26 }} />  {/* icon slightly smaller */}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5, fontSize: '1.125rem' }} /* slightly bigger text */
                  >
                    {c.title}
                  </Typography>

                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.97rem' }}>
                    Quick access to {c.title.toLowerCase()}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
