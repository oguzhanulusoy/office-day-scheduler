import * as React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Rowing } from '@mui/icons-material';

function OutlinedCard({ user }) {
  return (
      <Box display="flex" flexWrap="wrap">
        <React.Fragment>
          <CardContent sx={{ width: 500, height: 160, backgroundColor: 'white'}}>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Name:</strong> {user.firstName}
            </Typography>
            <Typography style={{ fontSize: 15 }} variant="body2">
              <strong>Surname:</strong> {user.firstName}
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
          <CardContent sx={{ml: 20, width: 500, height: 160, backgroundColor: 'white'}}>
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
      </Box>
  );
}

export default OutlinedCard;