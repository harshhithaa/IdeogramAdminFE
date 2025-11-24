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
    state && state.type == 'View'
      ? 'View'
      : state && state.type == 'Edit'
      ? 'Update'
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
          { MediaRef: existing.MediaRef, IsActive: 0, SelectionId: existing.SelectionId }
        ]);
        return prev.filter((p) => p.SelectionId !== existing.SelectionId);
      }

      // select: remove any deleted record for this media then add new selection
      setdeletedplaylistMedia((delPrev) => delPrev.filter((d) => d.MediaRef !== item.MediaRef));
      const newId = selectionCounter;
      setSelectionCounter((c) => c + 1);
      return [...prev, { MediaRef: item.MediaRef, IsActive: 1, SelectionId: newId }];
    });
  }

  // Remove a specific selection badge (by SelectionId) — used by badge click (keeps deleted list behavior)
  function removeSelection(selectionId) {
    setplaylistMedia((prev) => {
      const toRemove = prev.find((p) => p.SelectionId === selectionId);
      if (!toRemove) return prev;

      setdeletedplaylistMedia((delPrev) => [
        ...delPrev,
        { MediaRef: toRemove.MediaRef, IsActive: 0, SelectionId: selectionId }
      ]);

      return prev.filter((p) => p.SelectionId !== selectionId);
    });
  }

  function handlePriority(mediaRef) {
    const priorityIndex = playlistMedia.findIndex((i) => i.MediaRef === mediaRef) + 1;
    return priorityIndex > 0 ? priorityIndex : '';
  }

  function savePlaylistDetails() {
    const savePlaylistData = {
      PlaylistName: title,
      Description: description,
      Playlist: [
        ...playlistMedia.map((p) => ({ MediaRef: p.MediaRef, IsActive: p.IsActive })),
        ...deletedplaylistMedia.map((p) => ({ MediaRef: p.MediaRef, IsActive: p.IsActive }))
      ],
      IsActive: 1
    };
    if (id !== '') savePlaylistData.PlaylistRef = id;
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
            overflow: 'hidden'
          }}
        >
          <Formik initialValues={{ title, description }}>
            {({ errors, handleBlur, handleSubmit, touched }) => (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Top area - heading and fields */}
                <Box sx={{ flex: '0 0 auto', mb: 2, py: 1 }}>
                  {/* Heading styled similar to "Create Split Screen" */}
                  <Typography variant="h4" sx={{ textAlign: 'left', fontWeight: 700, mb: 2 }}>
                    {type} Playlist
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.title && errors.title)}
                        fullWidth
                        helperText={touched.title && errors.title}
                        label="Title"
                        margin="normal"
                        name="title"
                        onBlur={handleBlur}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        variant="outlined"
                        InputLabelProps={{ sx: { color: 'text.primary', fontWeight: 550, fontSize: '1rem' } }}
                        sx={{ '& .MuiInputBase-input': { color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.description && errors.description)}
                        fullWidth
                        helperText={touched.description && errors.description}
                        label="Description"
                        margin="normal"
                        name="description"
                        onBlur={handleBlur}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        variant="outlined"
                        InputLabelProps={{ sx: { color: 'text.primary', fontWeight: 550, fontSize: '1rem' } }}
                        sx={{ '& .MuiInputBase-input': { color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 } }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Media area - match Media page styling exactly */}
                <Box sx={{
                  flex: '1 1 auto',
                  pt: 2,
                  pb: 2,
                  overflow: 'hidden'
                }}>
                  {/* content wrapper matched to MediaList/MediaGrid */ }
                  <Box sx={{
                    borderRadius: `${panelRadius}px`,
                    backgroundColor: panelBg,
                    p: 2,
                    border: `1px solid ${panelBorder}`,
                    mt: 0,
                    overflow: 'visible',
                    boxSizing: 'border-box',
                    minHeight: 420
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
                        gap: 2,
                        width: '100%',
                        boxSizing: 'border-box',
                        maxHeight: '60vh',
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

                                {/* numbering is rendered inside the checked checkbox above; no separate badges */}
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
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                </Box>

                {/* Footer - centered button */}
                <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', pt: 2 }}>
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
