import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { IconEye } from "@tabler/icons";

export default {
    detailsStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #FFFFFF',
        boxShadow: 24,
        p: 2,
    },

    editStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #FFFFFF',
        boxShadow: 24,
        p: 2,
    },
    schedulePageColumns: [
        {
            name: "registrationNumber",
            label: "Registration Number",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "userFirstName",
            label: "First Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "userLastName",
            label: "Last Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "userEmail",
            label: "Email",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "userStatus",
            label: "User Status",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "officeDay",
            label: "Office Day",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "vacation",
            label: "Vacation",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "workFromHome",
            label: "Work From Home",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "totalDay",
            label: "Total Day",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "report",
            label: "Report",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "dateMonth",
            label: "Month",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "dateYear",
            label: "Year",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "edit",
            label: "Edit",
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <Button aria-label="edit"><EditIcon style={{color:"#9e9e9e"}}></EditIcon></Button>
                    );
                }
            }
        },
        {
            name: "detail",
            label: "See Details",
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <Button aria-label="edit"><IconEye style={{color:"#9e9e9e"}}></IconEye></Button>
                    );  
                }
            }
        }
    ],

    scheduleDetailsColumns: [
        { field: 'id', headerName: 'ID', width: 100, sortable: false },
        { field: 'officeDay', headerName: 'Office Day', width: 250, sortable: false },
        { field: 'day', headerName: 'Day', width: 200, sortable: false }
    ]
}