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
} from '@material-ui/core';
import PropTypes from 'prop-types';
import PreviewModal from './PlaylistPreview';


const PlaylistListResults = (props) => {
  const { playlists ,search} = props || {};
  const [selectedPlaylistRefs, setSelectedPlaylistRefs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [showPreviewModal, setshowPreviewModal] = useState(false);
  const [allchecked, setall] = useState(false);
  const [Media, setMedia] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedPlaylistRefs;
setall(event.target.checked)
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
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          { showPreviewModal && <PreviewModal Media={Media}/>}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                    allchecked
                    }
                    color="primary"
                    indeterminate={
                      selectedPlaylistRefs.length > 0
                      && selectedPlaylistRefs.length < playlists
                      && playlists.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Playlist Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Preview</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playlists&&playlists
              .filter(item=>item.Name.includes(search))
                .slice(page * limit, page * limit + limit)
                .map((Playlist) => (
                  <TableRow
                    hover
                    key={Playlist.PlaylistRef}
                    selected={
                      selectedPlaylistRefs.indexOf(Playlist.PlaylistRef) !== -1
                    }
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedPlaylistRefs.indexOf(Playlist.PlaylistRef)
                          !== -1
                        }
                        onChange={(event) => handleSelectOne(event, Playlist.PlaylistRef)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell  onClick={()=>props.view(Playlist)} >
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {Playlist.Name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell  onClick={()=>props.view(Playlist)} >{Playlist.Description==='null'?'--':Playlist.Description}</TableCell>

                    <TableCell>
                      <Button
                        sx={{ mx: 1 }}
                        onClick={() => { 
                          setMedia(Playlist.Media)
                          handlePlaylistPreview(); }}
                      >
                        <SvgIcon fontSize="small" color="action">
                          <AirplayIcon />
                        </SvgIcon>
                      </Button>
                    </TableCell>
                    <TableCell onClick={()=>props.view(Playlist)} >
                      {Playlist.IsActive ? 'Active' : 'InActive'}
                    </TableCell>
                    <TableCell>{Playlist.CreatedOn}</TableCell>
                    <TableCell>
                      <Button
                        sx={{ mx: 1 }}
                        onClick={()=>props.editcall(Playlist)} 
                      >
                        <SvgIcon fontSize="small" color="action">
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
      <TablePagination
        component="div"
        count={playlists && playlists.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PlaylistListResults.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  playlists: PropTypes.array
};

export default PlaylistListResults;
