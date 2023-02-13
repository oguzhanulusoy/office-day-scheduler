import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default {
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
        }
    ] 
}