/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Airplay as AirplayIcon, Edit as EditIcon } from 'react-feather';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon
} from '@mui/material';
import PropTypes from 'prop-types';
import PreviewModal from './PlaylistPreview';

const PlaylistListResults = (props) => {
  const { playlists, search } = props || {};
  const [selectedPlaylistRefs, setSelectedPlaylistRefs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [showPreviewModal, setshowPreviewModal] = useState(false);
  const [allchecked, setall] = useState(false);
  const [Media, setMedia] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedPlaylistRefs;
    setall(event.target.checked);
    if (event.target.checked) {
      newSelectedPlaylistRefs = playlists.map(
        (Playlist) => Playlist.PlaylistRef
      );
    } else {
      newSelectedPlaylistRefs = [];
    }
    props.setselected(newSelectedPlaylistRefs);
    setSelectedPlaylistRefs(newSelectedPlaylistRefs);
  };

  const handleSelectOne = (event, PlaylistRef) => {
    const selectedIndex = selectedPlaylistRefs.indexOf(PlaylistRef);
    let newSelectedPlaylistRefs = [];

    if (selectedIndex === -1) {
      newSelectedPlaylistRefs = newSelectedPlaylistRefs.concat(
        selectedPlaylistRefs,
        PlaylistRef
      );
    } else if (selectedIndex === 0) {
      newSelectedPlaylistRefs = newSelectedPlaylistRefs.concat(
        selectedPlaylistRefs.slice(1)
      );
    } else if (selectedIndex === selectedPlaylistRefs.length - 1) {
      newSelectedPlaylistRefs = newSelectedPlaylistRefs.concat(
        selectedPlaylistRefs.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedPlaylistRefs = newSelectedPlaylistRefs.concat(
        selectedPlaylistRefs.slice(0, selectedIndex),
        selectedPlaylistRefs.slice(selectedIndex + 1)
      );
    }
    props.setselected(newSelectedPlaylistRefs);
    setSelectedPlaylistRefs(newSelectedPlaylistRefs);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePlaylistPreview = () => {
    console.log('handlePlaylistPreview');
    setshowPreviewModal(!showPreviewModal);
  };

  return (
    <Card sx={{ boxShadow: 2 }}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          {showPreviewModal && <PreviewModal Media={Media} />}
          <Table>
            {/* ✅ IMPROVED TABLE HEAD */}
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid #ddd'
                }}
              >
                {/* ✅ Checkbox column - centered */}
                <TableCell
                  padding="checkbox"
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    width: '5%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Checkbox
                      checked={allchecked}
                      color="primary"
                      indeterminate={
                        selectedPlaylistRefs.length > 0
                        && selectedPlaylistRefs.length < playlists
                        && playlists.length
                      }
                      onChange={handleSelectAll}
                    />
                  </Box>
                </TableCell>

                {/* ✅ BOLD COLUMN HEADERS - LEFT ALIGNED */}
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    padding: '16px',
                    width: '20%'
                  }}
                >
                  Playlist Name
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    padding: '16px',
                    width: '20%'
                  }}
                >
                  Description
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    padding: '16px',
                    width: '12%'
                  }}
                >
                  Preview
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    padding: '16px',
                    width: '18%'
                  }}
                >
                  Creation Date
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    padding: '16px',
                    width: '10%'
                  }}
                >
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ✅ IMPROVED TABLE BODY */}
            <TableBody>
              {playlists && playlists
                .filter((item) => item.Name?.toLowerCase().includes(search?.toLowerCase()))
                .slice(page * limit, page * limit + limit)
                .map((Playlist) => (
                  <TableRow
                    hover
                    key={Playlist.PlaylistRef}
                    selected={
                      selectedPlaylistRefs.indexOf(Playlist.PlaylistRef) !== -1
                    }
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f9f9f9'
                      },
                      borderBottom: '1px solid #eee',
                      height: 64
                    }}
                  >
                    {/* ✅ Checkbox cell - centered */}
                    <TableCell
                      padding="checkbox"
                      align="center"
                      sx={{ padding: '12px 16px', width: '5%' }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Checkbox
                          checked={
                            selectedPlaylistRefs.indexOf(Playlist.PlaylistRef)
                            !== -1
                          }
                          onChange={(event) => handleSelectOne(event, Playlist.PlaylistRef)}
                          value="true"
                        />
                      </Box>
                    </TableCell>

                    {/* ✅ Playlist Name - left aligned */}
                    <TableCell
                      align="left"
                      onClick={() => props.view(Playlist)}
                      sx={{
                        padding: '16px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        color: '#1976d2',
                        width: '20%',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      <Typography color="textPrimary" variant="body2">
                        {Playlist.Name}
                      </Typography>
                    </TableCell>

                    {/* ✅ Description - left aligned */}
                    <TableCell
                      align="left"
                      onClick={() => props.view(Playlist)}
                      sx={{
                        padding: '16px',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '0.9rem',
                        width: '20%',
                        '&:hover': {
                          backgroundColor: '#fafafa'
                        }
                      }}
                    >
                      {Playlist.Description === 'null' ? '--' : Playlist.Description}
                    </TableCell>

                    {/* ✅ Preview - centered */}
                    <TableCell
                      align="center"
                      sx={{ padding: '16px', width: '12%' }}
                    >
                      <Button
                        sx={{
                          minWidth: 40,
                          padding: '8px',
                          display: 'flex',
                          justifyContent: 'center',
                          margin: '0 auto',
                          '&:hover': {
                            backgroundColor: '#e3f2fd'
                          }
                        }}
                        onClick={() => {
                          setMedia(Playlist.Media);
                          handlePlaylistPreview();
                        }}
                      >
                        <SvgIcon fontSize="small" color="primary">
                          <AirplayIcon />
                        </SvgIcon>
                      </Button>
                    </TableCell>

                    {/* ✅ Creation Date - centered */}
                    <TableCell
                      align="center"
                      sx={{
                        padding: '16px',
                        color: '#999',
                        fontSize: '0.9rem',
                        width: '18%'
                      }}
                    >
                      {Playlist.CreatedOn}
                    </TableCell>

                    {/* ✅ Edit - centered */}
                    <TableCell
                      align="center"
                      sx={{ padding: '16px', width: '10%' }}
                    >
                      <Button
                        sx={{
                          minWidth: 40,
                          padding: '8px',
                          display: 'flex',
                          justifyContent: 'center',
                          margin: '0 auto',
                          '&:hover': {
                            backgroundColor: '#e3f2fd'
                          }
                        }}
                        onClick={() => props.editcall(Playlist)}
                      >
                        <SvgIcon fontSize="small" color="primary">
                          <EditIcon />
                        </SvgIcon>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>

      {/* ✅ IMPROVED PAGINATION */}
      <TablePagination
        component="div"
        count={playlists && playlists.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          borderTop: '2px solid #eee',
          backgroundColor: '#f9f9f9'
        }}
      />
    </Card>
  );
};

PlaylistListResults.propTypes = {
  playlists: PropTypes.array
};

export default PlaylistListResults;
