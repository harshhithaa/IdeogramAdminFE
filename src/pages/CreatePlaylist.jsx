/* eslint-disable linebreak-style */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-sequences */
/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import CardMedia from '@mui/material/CardMedia';
import { Alert, Stack, Checkbox } from '@mui/material';
import { Box, Button, Container, TextField, Typography, Grid } from '@mui/material';
import { connect } from 'react-redux';
import { COMPONENTS } from 'src/utils/constant.jsx';
import { getUserComponentList, savePlaylist } from '../store/action/user';

const CreatePlaylist = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [type] = useState(
    state && state.type === 'View'
      ? 'View'
      : state && state.type === 'Edit'
      ? 'Edit'   // show "Edit Playlist" instead of "Update Playlist"
      : 'Create'
  );

  const { component } = props || {};
  const [title, setTitle] = useState((state && state.Name) || '');
  const [description, setDescription] = useState((state && state.Description) || '');
  const [media, setMedia] = useState([]);
  const [id] = useState((state && state.PlaylistRef) || '');

  const [loader, setloader] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [playlistMedia, setplaylistMedia] = useState([]);
  const [deletedplaylistMedia, setdeletedplaylistMedia] = useState([]);
  const [selectionCounter, setSelectionCounter] = useState(1); // unique incremental id for each selection

  const [box, setbox] = useState(false);
  const [boxMessage, setboxMessage] = useState('');
  const [color, setcolor] = useState('success');

  // visual constants matched to Media page
  const panelBg = 'rgba(25,118,210,0.03)';
  const panelRadius = 8;
  const panelBorder = 'rgba(0,0,0,0.02)';
  const cardBorder = 'rgba(0,0,0,0.06)';

  useEffect(() => {
    const data = { componenttype: COMPONENTS.Media };

    props.getUserComponentList(data, (err) => {
      if (err && err.exists) {
        console.log('err.errmessage', err.errmessage);
      } else {
        setMedia(component ? component.mediaList || [] : []);
        setloader(true);
      }
    });

    setMediaData(media);
    setplaylistMedia([]); // do not preselect
  }, [loader]);

  // Toggle selection: only one selection per media allowed.
  function handleSelectPlaylist(item) {
    setplaylistMedia((prev) => {
      const existing = prev.find((p) => p.MediaRef === item.MediaRef);
      if (existing) {
        // unselect: move to deleted list (for edits) and remove from active
        setdeletedplaylistMedia((delPrev) => [
          ...delPrev,
          { MediaRef: existing.MediaRef, IsActive: 0, SelectionId: existing.SelectionId, Duration: existing.Duration || null }
        ]);
        return prev.filter((p) => p.SelectionId !== existing.SelectionId);
      }

      // select: remove any deleted record for this media then add new selection
      setdeletedplaylistMedia((delPrev) => delPrev.filter((d) => d.MediaRef !== item.MediaRef));
      const newId = selectionCounter;
      setSelectionCounter((c) => c + 1);
      // default Duration is 10 seconds on selection
      return [...prev, { MediaRef: item.MediaRef, IsActive: 1, SelectionId: newId, Duration: 10 }];
    });
  }

  // Remove a specific selection badge (by SelectionId) — used by badge click (keeps deleted list behavior)
  function removeSelection(selectionId) {
    setplaylistMedia((prev) => {
      const toRemove = prev.find((p) => p.SelectionId === selectionId);
      if (!toRemove) return prev;

      setdeletedplaylistMedia((delPrev) => [
        ...delPrev,
        { MediaRef: toRemove.MediaRef, IsActive: 0, SelectionId: selectionId, Duration: toRemove.Duration || null }
      ]);

      return prev.filter((p) => p.SelectionId !== selectionId);
    });
  }

  // adjust duration (delta can be +1 / -1)
  function adjustDuration(mediaRef, delta) {
    setplaylistMedia((prev) =>
      prev.map((p) => {
        if (p.MediaRef !== mediaRef) return p;
        let next = Number(p.Duration || 10) + delta;
        if (next < 1) next = 1;
        if (next > 60) next = 60; // clamp to 60
        return { ...p, Duration: next };
      })
    );
  }

  function onDurationInputChange(mediaRef, value) {
    // allow empty during typing, but sanitize on blur/save
    let parsed = parseInt(value, 10);
    if (isNaN(parsed)) parsed = '';
    if (parsed !== '' && parsed > 60) parsed = 60;
    if (parsed !== '' && parsed < 1) parsed = 1;
    setplaylistMedia((prev) =>
      prev.map((p) => (p.MediaRef === mediaRef ? { ...p, Duration: parsed === '' ? '' : parsed } : p))
    );
  }

  function onDurationBlur(mediaRef) {
    setplaylistMedia((prev) =>
      prev.map((p) => {
        if (p.MediaRef !== mediaRef) return p;
        let value = Number(p.Duration || 10);
        if (isNaN(value) || value < 1) value = 10;
        if (value > 60) value = 60;
        return { ...p, Duration: value };
      })
    );
  }

  function handlePriority(mediaRef) {
    const priorityIndex = playlistMedia.findIndex((i) => i.MediaRef === mediaRef) + 1;
    return priorityIndex > 0 ? priorityIndex : '';
  }

  function savePlaylistDetails() {
    // send keys that match backend validation (lowercase top-level names)
    const savePlaylistData = {
      playlistName: title,
      description: description,
      playlist: [
        ...playlistMedia.map((p) => ({ MediaRef: p.MediaRef, IsActive: p.IsActive, Duration: p.Duration || 10 })),
        ...deletedplaylistMedia.map((p) => ({ MediaRef: p.MediaRef, IsActive: p.IsActive, Duration: p.Duration || null }))
      ],
      isActive: 1
    };
    if (id !== '') savePlaylistData.playlistRef = id;
    window.scrollTo(0, 0);
    props.savePlaylist(savePlaylistData, (err) => {
      if (err && err.exists) {
        setcolor('error');
        setboxMessage(err.errmessage || 'Error saving playlist');
        setbox(true);
      } else {
        navigate('/app/playlists', { replace: true });
      }
    });
  }

  return (
    <>
      <Helmet>
        <title>Create Playlist | Ideogram</title>
      </Helmet>

      {box && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity={color}>{boxMessage}</Alert>
        </Stack>
      )}

      <Box
        sx={{
          backgroundColor: 'background.default',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            py: 2,
            overflow: 'visible' // allow the footer button (moved below) to be visible
          }}
        >
          <Formik initialValues={{ title, description }}>
            {({ errors, handleBlur, handleSubmit, touched }) => (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Top area - heading and fields */}
                <Box sx={{ flex: '0 0 auto', mb: 1, py: 0.5 }}>
                  {/* Heading styled similar to "Create Split Screen" */}
                  <Typography variant="h4" sx={{ textAlign: 'left', fontWeight: 700, mb: 1 }}>
                    {type} Playlist
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.title && errors.title)}
                        fullWidth
                        helperText={touched.title && errors.title}
                        label="Title"
                        margin="dense"
                        name="title"
                        onBlur={handleBlur}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        variant="outlined"
                        InputLabelProps={{ sx: { color: 'text.primary', fontWeight: 550, fontSize: '1rem' } }}
                        sx={{ '& .MuiInputBase-input': { color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 }, mt: 0.5 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.description && errors.description)}
                        fullWidth
                        helperText={touched.description && errors.description}
                        label="Description"
                        margin="dense"
                        name="description"
                        onBlur={handleBlur}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        variant="outlined"
                        InputLabelProps={{ sx: { color: 'text.primary', fontWeight: 550, fontSize: '1rem' } }}
                        sx={{ '& .MuiInputBase-input': { color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 }, mt: 0.5 }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Media area - match Media page styling exactly */}
                <Box sx={{
                  flex: '1 1 auto',
                  pt: 1,
                  pb: 1,
                  overflow: 'hidden'
                }}>
                  {/* content wrapper matched to MediaList/MediaGrid */ }
                  <Box sx={{
                    borderRadius: `${panelRadius}px`,
                    backgroundColor: panelBg,
                    p: 1,
                    position: 'relative',            // allow absolutely positioned button inside panel
                    border: `1px solid ${panelBorder}`,
                    mt: 0,
                    overflow: 'visible',
                    boxSizing: 'border-box',
                    /* allow the panel to size within the page so footer stays visible */
                    minHeight: 'auto'
                  }}>
                    {/* internal grid uses same columns/spacing as Media page */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'repeat(2, 1fr)',
                          sm: 'repeat(3, 1fr)',
                          md: 'repeat(4, 1fr)',
                          lg: 'repeat(5, 1fr)'
                        },
                        gap: 1, /* keep existing grid spacing and per-item sizes */
                        width: '100%',
                        boxSizing: 'border-box',
                        /* keep a generous visible area but allow internal scrolling */
                        maxHeight: { xs: '46vh', sm: '48vh', md: '54vh', lg: '58vh' },
                        overflowY: 'auto',
                        pr: 1
                      }}
                    >
                      {Array.isArray(media) && media.length === 0 && (
                        <Box sx={{ gridColumn: '1/-1', textAlign: 'center', color: 'text.secondary', p: 4 }}>
                          No media uploaded.
                        </Box>
                      )}

                      {Array.isArray(media) &&
                        media.map((item) => {
                          const selectionsForMedia = playlistMedia.filter((s) => s.MediaRef === item.MediaRef);
                          const isSelected = selectionsForMedia.length > 0;
                          const orderNumber = isSelected ? (playlistMedia.findIndex((p) => p.MediaRef === item.MediaRef) + 1) : null;

                          return (
                            <Box
                              key={item.MediaRef || item.MediaPath}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                                width: '100%',
                                maxWidth: 180,
                                minWidth: 0,
                                aspectRatio: '1 / 1',
                                justifySelf: 'center'
                              }}
                            >
                              <Box
                                component="button"
                                type="button"
                                onClick={() => handleSelectPlaylist(item)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') handleSelectPlaylist(item);
                                }}
                                sx={{
                                  width: '100%',
                                  aspectRatio: '1 / 1',
                                  position: 'relative',
                                  borderRadius: `${panelRadius}px`,
                                  overflow: 'hidden',
                                  border: (theme) => `1px solid ${cardBorder}`,
                                  cursor: 'pointer',
                                  backgroundColor: 'background.paper',
                                  padding: 0,
                                  textAlign: 'left',
                                  boxShadow: isSelected ? '0 8px 22px rgba(25,118,210,0.12)' : 'none',
                                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                                  '&:hover': { transform: 'translateY(-4px)' }
                                }}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectPlaylist(item);
                                  }}
                                  onChange={() => {}}
                                  icon={
                                    <Box
                                      sx={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 0,
                                        border: '2px solid rgba(255,255,255,0.85)',
                                        backgroundColor: 'rgba(255,255,255,0.08)'
                                      }}
                                    />
                                  }
                                  checkedIcon={
                                    <Box
                                      sx={(theme) => ({
                                        width: 22,
                                        height: 22,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: 12,
                                        color: '#fff',
                                        borderRadius: 0,
                                        backgroundColor: theme.palette.primary.main,
                                        border: `2px solid ${theme.palette.primary.main}`
                                      })}
                                    >
                                      {orderNumber}
                                    </Box>
                                  }
                                  sx={{ position: 'absolute', left: 8, top: 8, zIndex: 20, padding: 0 }}
                                />

                                <CardMedia
                                  component={item.MediaType === 'image' ? 'img' : 'video'}
                                  src={item.MediaPath}
                                  alt={item.MediaName || ''}
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    pointerEvents: 'none',
                                    aspectRatio: '1 / 1',
                                    minHeight: 0,
                                    minWidth: 0
                                  }}
                                  controls={item.MediaType !== 'image'}
                                />

                                <Box
                                  sx={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    p: '8px',
                                    background: 'rgba(0,0,0,0.65)',
                                    color: '#fff',
                                    fontSize: 13
                                  }}
                                >
                                  {item.MediaName || item.MediaPath || 'Untitled'}
                                </Box>
                              </Box>

                              {/* DURATION CONTROL: small translucent overlay inside the thumbnail */}
                              {isSelected && (
                                <Box
                                  onClick={(e) => e.stopPropagation()}
                                  sx={{
                                    position: 'absolute',
                                    bottom: 10,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    borderRadius: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    p: '4px 6px',
                                    zIndex: 30,
                                    boxShadow: '0 6px 14px rgba(15,23,42,0.12)',
                                    minWidth: 120,
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      adjustDuration(item.MediaRef, -1);
                                    }}
                                    sx={{ minWidth: 28, width: 28, height: 28, padding: 0, fontSize: 16 }}
                                    aria-label="decrease-duration"
                                  >
                                    -
                                  </Button>

                                  <TextField
                                    inputProps={{
                                      inputMode: 'numeric',
                                      pattern: '[0-9]*',
                                      style: { textAlign: 'center', padding: '6px 4px' }
                                    }}
                                    value={
                                      // show stored duration or default 10
                                      (playlistMedia.find((p) => p.MediaRef === item.MediaRef) || {}).Duration ?? 10
                                    }
                                    onChange={(e) => onDurationInputChange(item.MediaRef, e.target.value)}
                                    onBlur={() => onDurationBlur(item.MediaRef)}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      width: 48,
                                      '& .MuiInputBase-root': { height: 32 },
                                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.12)' }
                                    }}
                                  />

                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      adjustDuration(item.MediaRef, +1);
                                    }}
                                    sx={{ minWidth: 28, width: 28, height: 28, padding: 0, fontSize: 16 }}
                                    aria-label="increase-duration"
                                  >
                                    +
                                  </Button>

                                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                                    sec
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                    </Box>

                    {/* removed absolute-positioned duplicate button so the single existing button below is used */}
                  </Box>
                </Box>
 
                {/* existing primary action kept here — fully outside the media panel, non-overlapping */}
                <Box sx={{ mt: 0.5, mb: 8.5, display: 'flex', justifyContent: 'center' }}>
                  <Button color="primary" size="large" type="button" variant="contained" onClick={() => savePlaylistDetails()}>
                    {type} Playlist
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
  const component = root.user?.components;
  return { component };
};

const mapDispatchToProps = (dispatch) => ({
  getUserComponentList: (data, callback) => dispatch(getUserComponentList(data, callback)),
  savePlaylist: (data, callback) => dispatch(savePlaylist(data, callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePlaylist);
