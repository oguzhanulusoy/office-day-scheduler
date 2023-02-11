import * as React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function OutlinedCard({user}) {
return (
    <Box sx={{ width: 500, height:160, backgroundColor:'white' }}>
      <React.Fragment>
      <CardContent>
        <Typography style={{fontSize: 15}} variant="body2">
          Name: {user.firstName}
        </Typography>
        <Typography style={{fontSize: 15}} variant="body2">
          Surname: {user.firstName}
        </Typography>
        <Typography style={{fontSize: 15}} variant="body2">
          Registration Number: {user.registrationNumber}
        </Typography>
        <Typography style={{fontSize: 15}} variant="body2">
          Email: {user.email}
        </Typography>
        <Typography style={{fontSize: 15}} variant="body2">
          Role: {user.roleName}
        </Typography>
      </CardContent>
    </React.Fragment>
    </Box>
  );
}

export default OutlinedCard;