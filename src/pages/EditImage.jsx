import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveMedia } from '../store/action/user';
import {
  Button,
  Box,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilerobotImageEditor from 'react-filerobot-image-editor';

// Optional: if your bundle doesn't include filerobot CSS, uncomment the next line
// import 'react-filerobot-image-editor/dist/index.css';

const EditImage = ({ saveMedia: uploadMedia }) => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' });
  const [mediaName, setMediaName] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [editedImage, setEditedImage] = useState(null);

  // If navigation provided an image, prepare to open editor
  useEffect(() => {
    const incoming = location.state;
    if (incoming && typeof incoming === 'object' && incoming.src) {
      setImageSrc(incoming.src);
      setEditorOpen(true);
    } else if (typeof incoming === 'string' && incoming) {
      setImageSrc(incoming);
      setEditorOpen(true);
    }
  }, [location.state]);

  // Fallback: let user pick a local file if no image was passed
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e?.target?.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target.result);
      setEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle save from Filerobot
  const handleSave = (editedObj) => {
    if (editedObj && editedObj.imageBase64) {
      setEditedImage(editedObj.imageBase64);
      setEditorOpen(false);
    }
  };

  // Handle upload and download (unchanged)
  const handleDownloadAndUpload = async () => {
    try {
      if (!editedImage) throw new Error('No image to save');
      const res = await fetch(editedImage);
      const blob = await res.blob();
      const safeName = (mediaName && mediaName.trim()) ? mediaName.trim() : `edited_media`;
      const filename = `${safeName}.png`;

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Upload
      const formdata = new FormData();
      const file = new File([blob], filename, { type: blob.type });
      formdata.append('Media', file);

      uploadMedia(formdata, (err) => {
        if (err?.exists) {
          setSnack({ open: true, severity: 'error', msg: err.err || 'Upload failed' });
        } else {
          setSnack({ open: true, severity: 'success', msg: 'Image downloaded and uploaded to media' });
        }
      });
    } catch (e) {
      setSnack({ open: true, severity: 'error', msg: e.message || 'Operation failed' });
    }
  };

  return (
    <Box sx={{ position: 'relative', maxWidth: 1200, mx: 'auto' }}>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity}>
          {snack.msg}
        </Alert>
      </Snackbar>

      {/* If no editor image present, show button to pick a file (fallback) */}
      {!imageSrc && !editorOpen && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: 'none' }}
          />
          <Button variant="contained" color="primary" onClick={openFilePicker}>
            Open Editor (Choose image)
          </Button>
        </Box>
      )}

      {/* Full-screen Dialog overlay for the Filerobot editor to ensure visibility */}
      <Dialog fullScreen open={editorOpen} onClose={() => setEditorOpen(false)}>
        <AppBar position="relative" sx={{ backgroundColor: '#fff', color: '#000' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Image Editor
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setEditorOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Editor container - fill available dialog space */}
        <Box sx={{ width: '100%', height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden' }}>
          {imageSrc ? (
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <FilerobotImageEditor
                source={imageSrc}
                onSave={handleSave}
                onClose={() => setEditorOpen(false)}
                annotationsCommon={{ fill: '#1976d2' }}
                Text={{ text: 'Add text here' }}
                Rotate={{ angle: 0, componentType: 'slider' }}
                Crop={{
                  presetsItems: [
                    { titleKey: 'classicTv', descriptionKey: '4:3', ratio: 4 / 3 },
                    { titleKey: 'cinemascope', descriptionKey: '16:9', ratio: 16 / 9 },
                    { titleKey: 'square', descriptionKey: '1:1', ratio: 1 / 1 }
                  ],
                  presetsFolders: [
                    {
                      titleKey: 'socialMedia', descriptionKey: 'Social Media',
                      groups: [
                        { titleKey: 'fbProfile', descriptionKey: 'Facebook Profile', ratio: 1 },
                        { titleKey: 'fbCover', descriptionKey: 'Facebook Cover', ratio: 820 / 312 }
                      ]
                    }
                  ]
                }}
                tabsIds={['adjust', 'filters', 'finetune', 'resize', 'crop', 'rotate', 'draw', 'text']}
                defaultTabId={'adjust'}
                theme={{
                  palette: {
                    'bg-primary': '#fff',
                    'accent-primary': '#1976d2',
                    'accent-secondary': '#1565c0'
                  }
                }}
                savingPixelRatio={1}
                previewPixelRatio={1}
                language="en"
                showGoBackBtn={false}
                style={{ width: '100%', height: '100%' }}
              />
            </Box>
          ) : (
            <Box sx={{ m: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No image selected. Close and choose an image to edit.
              </Typography>
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Preview and Save Controls */}
      {!editorOpen && editedImage && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src={editedImage}
            alt="Edited preview"
            style={{
              maxWidth: '100%',
              maxHeight: 400,
              borderRadius: 8,
              border: '1px solid #eee',
              objectFit: 'contain'
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={10} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  label="Name for media"
                  value={mediaName}
                  onChange={(e) => setMediaName(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs="auto">
                <Button variant="contained" color="primary" onClick={handleDownloadAndUpload}>
                  DOWNLOAD & SAVE
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  saveMedia: (data, cb) => dispatch(saveMedia(data, cb))
});

export default connect(null, mapDispatchToProps)(EditImage);
