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
    
    zonePageColumns: [
        {
            name: "zoneName",
            label: "Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "code",
            label: "Code",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "lowerBound",
            label: "Lower Bound",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "upperBound",
            label: "Upper Bound",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "price",
            label: "Price (₺)",
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