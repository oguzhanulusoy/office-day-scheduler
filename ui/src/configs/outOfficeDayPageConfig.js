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
    
    outOfficeDayPageColumns: [
        {
            name: "displayName",
            label: "Display Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "date",
            label: "Date (yyyy-mm-dd)",
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