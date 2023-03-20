import * as React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function OutlinedCard({ user, outOfOfficeDayList, userScheduleList }) {
  return (
      <Box display="flex" flexWrap="wrap">
        <React.Fragment>
          <CardContent sx={{ width: 500, height: 160, backgroundColor: 'white'}}>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Name:</strong> {user.firstName}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Surname:</strong> {user.lastName}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Registration Number:</strong> {user.registrationNumber}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Role:</strong> {user.roleName}
            </Typography>
          </CardContent>
        </React.Fragment>

        <React.Fragment>
          <CardContent sx={{ml: 15, width: 500, height: 160, backgroundColor: 'white'}}>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Department Code:</strong> {user.departmentCode}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Department Manager Name:</strong> {user.departmentManagerFirstName} {user.departmentManagerLastName}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Group Code:</strong> {user.groupCode}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Group Manager Name:</strong> {user.groupManagerFirstName} {user.groupManagerLastName}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Zone Name:</strong> {user.zoneName}
            </Typography>
          </CardContent>
        </React.Fragment>

        <React.Fragment>
          <CardContent sx={{mt: 5, width: 500, height: 160, backgroundColor: 'white'}}>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Schedule Info</strong>
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Office Day Count:</strong> {userScheduleList.officeDay}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>WFH Day Count:</strong> {userScheduleList.workFromHome}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Vacation Count:</strong> {userScheduleList.vacation}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Total Day:</strong> {userScheduleList.totalDay}
            </Typography>
          </CardContent>
        </React.Fragment>

        <React.Fragment>
          <CardContent sx={{mt: 5, ml: 15, width: 500, height: 160, backgroundColor: 'white'}}>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Out Office Day Info</strong>
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Out Office Day Count:</strong> {outOfOfficeDayList.length}
            </Typography>
          </CardContent>
        </React.Fragment>
      </Box>
  );
}

export default OutlinedCard;