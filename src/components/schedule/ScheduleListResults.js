/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Edit as EditIcon } from 'react-feather';
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

const ScheduleListResults = (props) => {
  const { Schedules,search } = props || {};
  const [selectedScheduleRefs, setSelectedScheduleRefs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [allchecked, setall] = useState(false);

  const handleSelectAll = (event) => {
    let newSelectedScheduleRefs;
    setall(event.target.checked)

    if (Schedules && Schedules.length > 0 && event.target.checked) {
      newSelectedScheduleRefs = Schedules.map(
        (schedule) => schedule.ScheduleRef
      );
    } else {
      newSelectedScheduleRefs = [];
    }
    props.setselected(newSelectedScheduleRefs);
    setSelectedScheduleRefs(newSelectedScheduleRefs);
  };

  const handleSelectOne = (event, ScheduleRef) => {
    const selectedIndex = selectedScheduleRefs.indexOf(ScheduleRef);
    let newSelectedScheduleRefs = [];

    if (selectedIndex === -1) {
      newSelectedScheduleRefs = newSelectedScheduleRefs.concat(
        selectedScheduleRefs,
        ScheduleRef
      );
    } else if (selectedIndex === 0) {
      newSelectedScheduleRefs = newSelectedScheduleRefs.concat(
        selectedScheduleRefs.slice(1)
      );
    } else if (selectedIndex === selectedScheduleRefs.length - 1) {
      newSelectedScheduleRefs = newSelectedScheduleRefs.concat(
        selectedScheduleRefs.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedScheduleRefs = newSelectedScheduleRefs.concat(
        selectedScheduleRefs.slice(0, selectedIndex),
        selectedScheduleRefs.slice(selectedIndex + 1)
      );
    }
    props.setselected(newSelectedScheduleRefs);

    setSelectedScheduleRefs(newSelectedScheduleRefs);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
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
                      selectedScheduleRefs.length > 0 &&
                      selectedScheduleRefs.length < Schedules &&
                      Schedules.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Schedule Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Assigned Playlist</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Schedules &&
                Schedules
                .filter(item=>item.Title.toLowerCase().includes(search.toLowerCase()))
                .slice(page * limit, page * limit + limit).map((schedule) => (
                  <TableRow
                    hover
                    key={schedule.ScheduleRef}
                    selected={
                      selectedScheduleRefs.indexOf(schedule.ScheduleRef) !== -1
                    }
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedScheduleRefs.indexOf(schedule.ScheduleRef) !==
                          -1
                        }
                        onChange={(event) =>
                          handleSelectOne(event, schedule.ScheduleRef)
                        }
                        value="true"
                      />
                    </TableCell>
                    <TableCell onClick={() => props.view(schedule)}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {schedule.Title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => props.view(schedule)}>
                      {(schedule.Description === 'null'||null)?'--':schedule.Description}
                    </TableCell>
                    <TableCell onClick={() => props.view(schedule)}>
                      {schedule.PlaylistName}
                    </TableCell>

                    <TableCell onClick={() => props.view(schedule)}>
                      {schedule.IsActive ? 'Active' : 'InActive'}
                    </TableCell>
                    <TableCell>{schedule.CreatedOn}</TableCell>
                    <TableCell>
                      <Button
                        sx={{ mx: 1 }}
                        onClick={() => props.editcall(schedule)}
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
        count={Schedules && Schedules.length > 0 ? Schedules.length : 0}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ScheduleListResults.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  Schedules: PropTypes.array
};

export default ScheduleListResults;
