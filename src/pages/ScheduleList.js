/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Button, Modal, Grid } from '@material-ui/core';
import ScheduleListResults from 'src/components/schedule/ScheduleListResults';
import ScheduleListToolbar from 'src/components/schedule/ScheduleListToolbar';
import { connect } from 'react-redux';
import { COMPONENTS } from 'src/utils/constant';
import {
  getUserComponentList,
  deleteComponentList
} from '../store/action/user';
import { useNavigate } from 'react-router-dom';

const ScheduleList = (props) => {
  const { schedule } = props || {};
  const [scheduleItem, setSchedules] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selected, setselected] = useState([]);
  const [showmodal, setModal] = useState(false);
  const [search, setsearch] = useState('');

  let navigate = useNavigate();
  useEffect(() => {
    const data = {
      componenttype: COMPONENTS.Schedule
    };
    props.getUserComponentList(data, (err) => {
      if (err.exists) {
        console.log(err);
      } else {
        setSchedules(schedule ? schedule.scheduleList : []);
        setLoader(true);
      }
    });
  }, [loader]);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  const deleteComponent = () => {
    const deleteData = {
      ComponentType: COMPONENTS.Schedule,
      ComponentList: selected
    };

    console.log('selected', selected);
    setModal(false);
    props.deleteComponentList(deleteData, (err) => {
      if (err.exists) {
        console.log(err.errmessage);
      } else {
        setLoader(false);
      }
    });
  };
  return (
    <>
      <Helmet>
        <title>Schedules | Ideogram</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Modal
            open={showmodal}
            onClose={() => setModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h2 id="parent-modal-title" style={{ marginBottom: 20 }}>
                Are you sure you want to delete?
              </h2>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => deleteComponent()}
                  >
                    Yes{' '}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setModal(false)}
                  >
                    No{' '}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <ScheduleListToolbar 
                    onsearch={(e)=>setsearch(e)}

          onclick={() => setModal(true)} />
          <Box sx={{ pt: 3 }}>
            <ScheduleListResults
              Schedules={scheduleItem}
              setselected={setselected}
              search={search}

              view={(e) =>
                navigate('/app/saveschedule', { state: { ...e, type: 'View' } })
              }
              editcall={(e) =>
                navigate('/app/saveschedule', { state:{...e, type: 'Edit'} })
              }
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};
const mapStateToProps = ({ root = {} }) => {
  const schedule = root.user.components;
  return {
    schedule
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserComponentList: (data, callback) =>
    dispatch(getUserComponentList(data, callback)),
  deleteComponentList: (data, callback) =>
    dispatch(deleteComponentList(data, callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleList);
