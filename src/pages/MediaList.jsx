/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Button,
  Grid,
  Modal,
  Pagination,
  Stack,
  Alert,
  TextField,
  InputAdornment,
  Checkbox,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import { Search as SearchIcon, Trash2 as Trash2Icon } from 'react-feather';
import { connect } from 'react-redux';
import { COMPONENTS } from 'src/utils/constant.jsx';
import {
  getUserComponentListWithPagination,
  validateDeleteComponentList,
  deleteComponentList
} from '../store/action/user';
import { useNavigate } from 'react-router-dom';

const MediaList = (props) => {
  const [mediaItem, setMedia] = useState([]);
  const [selected, setselected] = useState([]);
  const [showmodal, setModal] = useState(false);
  const [showErrModal, setErrModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('IMAGES');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filter states
  const [mediaTypeFilter, setMediaTypeFilter] = useState('');

  const [box, setbox] = useState(false);
  const [boxMessage, setboxMessage] = useState('');
  const [color, setcolor] = useState('success');

  const navigate = useNavigate();

  const buildSrc = (rawPath) => {
    if (!rawPath) return null;
    let p = String(rawPath);
    p = p.replace(/\\/g, '/').trim();
    if (p.indexOf('undefined') !== -1) return null;
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith('/')) return `${window.location.origin}${p}`;
    try { return `${window.location.origin}/${encodeURI(p)}`; } catch (e) { return p; }
  };

  const fetchMediaList = (page = currentPage, size = pageSize, search = searchQuery, mediaType = mediaTypeFilter) => {
    const requestData = {
      componenttype: 1,
      searchText: search || '',
      mediaType: mediaType || null,
      isActive: 1,
      userId: null,
      pageNumber: page,
      pageSize: size
    };

    props.getUserComponentListWithPagination(requestData, (response) => {
      if (response && !response.exists) {
        const data = response.data || {};
        const componentList = data.ComponentList || [];
        const total = data.TotalRecords || 0;
        setMedia(componentList);
        setTotalRecords(total);
        setTotalPages(Math.ceil(total / size));
      } else {
        setMedia([]);
        setTotalRecords(0);
        setTotalPages(0);
      }
    });
  };

  // initial load
  useEffect(() => { fetchMediaList(1, pageSize, searchQuery, mediaTypeFilter); }, []);

  useEffect(() => {
    // when filters or page changes refetch
    fetchMediaList(currentPage, pageSize, searchQuery, mediaTypeFilter);
  }, [currentPage, pageSize, mediaTypeFilter]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchMediaList(1, pageSize, query, mediaTypeFilter);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    let type = '';
    if (newValue === 'VIDEOS') type = 'video';
    else if (newValue === 'GIFs') type = 'gif';
    else if (newValue === 'IMAGES') type = 'image';
    setMediaTypeFilter(type);
    setCurrentPage(1);
    fetchMediaList(1, pageSize, searchQuery, type);
  };

  const style = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: 500,
    bgcolor: 'background.paper', border: '2px solid #000',
    boxShadow: 24, p: 4
  };

  const deleteComponent = () => {
    const deleteData = { ComponentType: COMPONENTS.Media, ComponentList: selected };
    setModal(false);
    props.validateDeleteComponentList(deleteData, (err) => {
      if (err?.exists) {
        setcolor('error'); setboxMessage('Validation error occurred'); setbox(true); return;
      }
      if (err?.err === 'attached') {
        setPlaylists([]); err.componentsAttached.forEach((item) => { setPlaylists((prev) => [...prev, item.PlaylistName]); });
        setErrModal(true); return;
      }
      props.deleteComponentList(deleteData, (delErr) => {
        if (delErr?.exists) {
          setcolor('error'); setboxMessage(delErr.err || delErr.errmessage || 'Delete failed'); setbox(true);
        } else {
          setcolor('success'); setboxMessage('Media Deleted Successfully!'); setbox(true); setselected([]);
          fetchMediaList(currentPage, pageSize, searchQuery, mediaTypeFilter);
        }
      });
    });
  };

  const toggleSelection = (MediaRef) => {
    const idx = selected.indexOf(MediaRef);
    let newSelected = [];
    if (idx === -1) newSelected = [...selected, MediaRef];
    else newSelected = selected.filter((r) => r !== MediaRef);
    setselected(newSelected);
  };

  const renderMediaCard = (item) => {
    const src = buildSrc(item?.MediaPath);
    const thumb = buildSrc(item?.Thumbnail || item?.MediaThumb || item?.Poster);
    const rawType = (item?.MediaType || '').toString().toLowerCase();
    const isVideo = rawType.startsWith('video') || (item?.MediaName || '').toLowerCase().match(/\.(mp4|webm|ogg|mov)$/);
    const isSelected = selected.indexOf(item.MediaRef) !== -1;

    return (
      <Box key={item.MediaRef} onClick={() => toggleSelection(item.MediaRef)}
        sx={{
          position: 'relative', borderRadius: '8px', overflow: 'hidden',
          bgcolor: '#fff', cursor: 'pointer',
          border: isSelected ? '2px solid #1976d2' : '1px solid #e5e7eb',
          transition: 'all 0.2s ease', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' }
        }}
      >
        <Checkbox checked={isSelected} onClick={(e) => e.stopPropagation()} onChange={() => toggleSelection(item.MediaRef)}
          sx={{ position: 'absolute', left: 8, top: 8, zIndex: 5, bgcolor: 'transparent', borderRadius: 0, padding: 0, '&:hover': { bgcolor: 'transparent' } }} />
        <Box sx={{ width: '100%', paddingTop: '100%', position: 'relative', bgcolor: '#f4f4f4' }}>
          {isVideo ? (
            thumb ? (
              <img src={thumb} alt={item.MediaName} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : src ? (
              <video src={src} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
            ) : (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No media</Box>
            )
          ) : (
            src ? (
              <img src={src} alt={item.MediaName} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No media</Box>
            )
          )}
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', bgcolor: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.MediaName}</Box>
      </Box>
    );
  };

  const handlePageChange = (event, value) => { setCurrentPage(value); fetchMediaList(value, pageSize, searchQuery, mediaTypeFilter); };

  return (
    <>
      <Helmet><title>Media | Ideogram</title></Helmet>

      {box && (
        <Stack sx={{ position: 'fixed', top: 80, right: 16, zIndex: 9999, width: 'auto', maxWidth: 400 }} spacing={2}>
          <Alert severity={color} onClose={() => setbox(false)}>{boxMessage}</Alert>
        </Stack>
      )}

      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Container maxWidth={false}>
          <Modal open={showmodal} onClose={() => setModal(false)}><Box sx={style}>
            <h4 style={{ marginBottom: 20 }}>Are you sure you want to delete {selected.length} item(s)?</h4>
            <Grid container spacing={2}><Grid item>
              <Button variant="contained" color="success" onClick={() => deleteComponent()}>Yes</Button>
            </Grid><Grid item>
              <Button variant="contained" color="error" onClick={() => setModal(false)}>No</Button>
            </Grid></Grid>
          </Box></Modal>

          <Modal open={showErrModal} onClose={() => setErrModal(false)}><Box sx={style}>
            <h4 style={{ marginBottom: 20 }}>Cannot delete this media as it is running in these playlists:</h4>
            <ul style={{ marginBottom: 20 }}>{playlists.map((playlist, index) => <li key={index}>{playlist}</li>)}</ul>
            <Grid container><Grid item>
              <Button variant="contained" color="success" onClick={() => { setErrModal(false); setPlaylists([]); }}>Ok</Button>
            </Grid></Grid>
          </Box></Modal>

          {/* Top Toolbar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 1400, bgcolor: '#fff', borderRadius: '8px', p: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                {/* Search Box */}
                <TextField size="small" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Search media"
                  sx={{ width: 300, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: '6px' } }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon size={18} color="#9ca3af" /></InputAdornment>) }} />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button variant="outlined" disabled={selected.length === 0} onClick={() => setModal(true)} startIcon={<Trash2Icon size={16} />}
                    sx={{ textTransform: 'none', borderColor: '#e5e7eb', color: '#6b7280', fontWeight: 500, '&:hover': { borderColor: '#d1d5db', bgcolor: '#f9fafb' }, '&.Mui-disabled': { borderColor: '#e5e7eb', color: '#d1d5db' } }}>
                    DELETE{selected.length > 0 ? ` (${selected.length})` : ''}
                  </Button>

                  <Button variant="contained" onClick={() => navigate('/app/savemedia')}
                    sx={{ textTransform: 'none', bgcolor: '#5b67d6', fontWeight: 600, px: 3, borderRadius: '6px', boxShadow: 'none', '&:hover': { bgcolor: '#4c5bc6', boxShadow: 'none' } }}>
                    ADD MEDIA
                  </Button>

                  <Button variant="contained" onClick={() => navigate('/app/createmedia')}
                    sx={{ textTransform: 'none', bgcolor: '#5b67d6', fontWeight: 600, px: 3, borderRadius: '6px', boxShadow: 'none', '&:hover': { bgcolor: '#4c5bc6', boxShadow: 'none' } }}>
                    CREATE MEDIA
                  </Button>

                  <Button variant="contained" onClick={() => navigate('/app/splitmedia')}
                    sx={{ textTransform: 'none', bgcolor: '#5b67d6', fontWeight: 600, px: 3, borderRadius: '6px', boxShadow: 'none', '&:hover': { bgcolor: '#4c5bc6', boxShadow: 'none' } }}>
                    CREATE SPLIT SCREEN
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Tabs + Grid */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 1400, bgcolor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ borderBottom: '1px solid #e5e7eb', px: 2, pt: 1 }}>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ minHeight: 48, '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: '#1976d2' } }}>
                  <Tab label="IMAGES" value="IMAGES" sx={{ textTransform: 'none', fontWeight: activeTab === 'IMAGES' ? 700 : 500, fontSize: '14px', color: activeTab === 'IMAGES' ? '#1976d2' : '#6b7280', minHeight: 48, px: 3 }} />
                  <Tab label="VIDEOS" value="VIDEOS" sx={{ textTransform: 'none', fontWeight: activeTab === 'VIDEOS' ? 700 : 500, fontSize: '14px', color: activeTab === 'VIDEOS' ? '#1976d2' : '#6b7280', minHeight: 48, px: 3 }} />
                  <Tab label="GIFs" value="GIFs" sx={{ textTransform: 'none', fontWeight: activeTab === 'GIFs' ? 700 : 500, fontSize: '14px', color: activeTab === 'GIFs' ? '#1976d2' : '#6b7280', minHeight: 48, px: 3 }} />
                </Tabs>
              </Box>

              <Box sx={{ p: 3, maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                {!mediaItem || mediaItem.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                    <Typography variant="body1" color="text.secondary">No media found</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
                    {mediaItem.map((item) => renderMediaCard(item))}
                  </Box>
                )}
              </Box>

              {totalPages > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3, borderTop: '1px solid #e5e7eb', gap: 2 }}>
                  <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="medium" showFirstButton showLastButton />
                  <Typography variant="body2" color="text.secondary">{totalRecords} items</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

const mapStateToProps = ({ root = {} }) => ({});
const mapDispatchToProps = (dispatch) => ({
  getUserComponentListWithPagination: (data, callback) => dispatch(getUserComponentListWithPagination(data, callback)),
  validateDeleteComponentList: (data, callback) => dispatch(validateDeleteComponentList(data, callback)),
  deleteComponentList: (data, callback) => dispatch(deleteComponentList(data, callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(MediaList);
