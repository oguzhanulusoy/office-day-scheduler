import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default {
    departmentPageColumns: [
        {
            name: "departmentCode",
            label: "Department Code",
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
            name: "edit",
            label: "Edit",
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <Button aria-label="edit"><EditIcon style={{ color: "#9e9e9e" }}></EditIcon></Button>
                    );
                }
            }
        }
    ]
}