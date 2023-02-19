import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default {
    style: {
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
    
    userListPageColumns: [
        {
            name: "registrationNumber",
            label: "Registration Number",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "firstName",
            label: "First Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "lastName",
            label: "Last Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "email",
            label: "Email",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "departmentCode",
            label: "Department",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "departmentManagerFirstName",
            label: "Department Manager Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "departmentManagerLastName",
            label: "Department Manager Surname",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "groupCode",
            label: "Group Code",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "groupManagerFirstName",
            label: "Group Manager Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "groupManagerLastName",
            label: "Group Manager Surname",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "zoneName",
            label: "Location",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "transportChoice",
            label: "Transportation",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "roleName",
            label: "Role",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "status",
            label: "Status",
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
                        <Button aria-label="edit" onClick={() => { }}><EditIcon style={{ color: "#9e9e9e" }}></EditIcon></Button>
                    );
                }
            }
        }
    ]
}