/* Use flexible full-height grid so cards always scale to fit the viewport (no vertical scroll).
   Cards and paddings use responsive units; grid rows use fractional units so content shrinks/expands.
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
          height: '100%', // parent (root) is 100vh
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          px: { xs: 1.5, md: 3 },
          py: { xs: 1, md: 2 },
          boxSizing: 'border-box'
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1400,
            mx: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
          {/* Header: modest fixed space so grid always fits */}
          <Box
            sx={{
              flex: '0 0 clamp(44px, 6vh, 72px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',   // center horizontally
              width: '100%',
              mb: { xs: 0.5, md: 1 },
              minHeight: 0
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: { xs: 'clamp(16px, 2.2vh, 20px)', md: 'clamp(18px, 2.6vh, 24px)' },
                textAlign: 'center'         // ensure text is centered
              }}
            >
              Dashboard Overview
            </Typography>
          </Box>

          {/* Centered 2x2 grid that fills remaining height; cards are centered inside cells */}
          <Box
            component="section"
            aria-label="Primary dashboard navigation"
            sx={{
              display: 'grid',
              flex: '1 1 auto',
              minHeight: 0,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gridTemplateRows: { xs: 'repeat(4, 1fr)', md: 'repeat(2, 1fr)' },
              // make row and column gaps identical so columns match row spacing
              rowGap: { xs: 0.75, md: 1 },
              columnGap: { xs: 0.75, md: 0 },
              alignItems: 'stretch',
              justifyItems: 'center',  // center cells horizontally
              overflow: 'hidden'
            }}
          >
            {cardConfig.map((c) => {
              const Icon = c.Icon;
              return (
                /* each grid cell contains a centered card smaller than full cell */
                <Box
                  key={c.id}
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0,
                    // remove extra horizontal cell padding so columns shift slightly inward
                    px: { xs: 0, md: 0 }
                  }}
                >
                  <Box
                    role="button"
                    tabIndex={0}
                    aria-label={`${c.title} page`}
                    onClick={() => navigate(c.to)}
                    onKeyDown={(e) => handleKey(e, c.to)}
                    sx={{
                      /* increased, proportionate card size but still inset from cell edges */
                      width: { xs: '95%', md: '95%' },
                      height: { xs: '95%', md: '95%' },
                      maxWidth: 680,
                      maxHeight: 420,
                      minHeight: 120,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: theme.shadows[2],
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      p: { xs: 1, md: 2 }, // balanced padding
                      cursor: 'pointer',
                      transition: 'transform 160ms ease, box-shadow 160ms ease',
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: theme.shadows[6]
                      },
                      '&:active': { transform: 'translateY(-1px) scale(0.995)' },
                      '&:focus': {
                        outline: `3px solid ${theme.palette.primary.light}`,
                        outlineOffset: '4px'
                      },
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 44, md: 56 }, // slightly larger icon container for better balance
                        height: { xs: 44, md: 56 },
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: { xs: 0.75, md: 1.25 },
                        bgcolor: `${c.color}.main`,
                        color: 'common.white',
                        boxShadow: theme.shadows[3],
                        flex: '0 0 auto'
                      }}
                      aria-hidden
                    >
                      <Icon sx={{ fontSize: { xs: 18, md: 26 } }} />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 0.5,
                        fontSize: { xs: '0.98rem', md: '1.12rem' }, // increased title size for better hierarchy
                        lineHeight: 1.05
                      }}
                    >
                      {c.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.84rem', md: '0.95rem' },
                        px: { xs: 1, md: 0 },
                        maxWidth: '90%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Quick access to {c.title.toLowerCase()}
                    </Typography>
                  </Box>
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
