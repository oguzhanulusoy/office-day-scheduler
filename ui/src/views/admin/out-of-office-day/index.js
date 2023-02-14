import { useState, useEffect } from 'react'
import MUIDataTable from "mui-datatables";
import { ThemeProvider, TextField, createTheme, Button, Modal, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OutOfOfficeDayService from 'services/out-of-office-day/OutOfOfficeDayService'; 
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from 'utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from 'utils/generalUtils';
import { toast } from "react-toastify";
function OutOfOfficeDayPage() {
  const navigate = useNavigate();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [createOpen, setCreateOpen]=useState(false);
  const [isLoaded, setIsLoaded]= useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedIdList, setSelectedIdList] = useState([]);
  const [dayName, setDayName] = useState("");
  const [date, setDate] = useState(null);
  const [toUpdate, setToUpdate] = useState(null);
    const handleUpdateOpen = () => {
      setUpdateOpen(true);
    }
    const handleCreateOpen = () => {
      setCreateOpen(true);
    }
    const handleUpdateClose = () => {
      setUpdateOpen(false);
      setDayName("");
      setDate(null);
    }
    const handleCreateClose = () => {
      setCreateOpen(false);
      setDayName("");
      setDate(null);
    }
    const updateOutOfOfficeDay = () => {
      let serviceCaller = new ServiceCaller();
      OutOfOfficeDayService.updateOutOfOfficeDay(serviceCaller, {id: toUpdate, displayName: dayName, date: date})
      .then((res) => {
        if (res.status === 401) {
          toast.error("You are not authorized to update this day", { autoClose: 1000 })
        }

        if (res.status === 200) {
          toast.success("Updated successfully", { autoClose: 1000 })
        } else {
          toast.error("An error occured while updating", { autoClose: 1000 })
        }

        setRefresh(true);
      })
      .catch((error) => {
        console.log(error);
      })
    }
    const handleUpdate = () => {
        updateOutOfOfficeDay();
        setDayName("");
        handleUpdateClose();
      }
    const loadDay = (id) => {
      const arr=rows.filter(item => item.id === id)
      setDayName(arr[0].displayName);
      setDate(arr[0].date);
    }
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: 'background.paper',
      border: '2px solid #FFFFFF',
      boxShadow: 24,
      p: 2,
    };
    
    const getOutOfOfficeDayData = () => {
        let serviceCaller = new ServiceCaller();
        OutOfOfficeDayService.getOutOfOfficeDays(serviceCaller, '')
        .then((res) => {
          if (res.status === 401) {
            toast.error("You are not authorized to view this page", { autoClose: 1000 })
            navigate('/', { replace: true });
            return
          }

          if (res.status !== 200) {
            toast.error("An error occurred while fetching data", { autoClose: 1000 })
            return
          }

          setIsLoaded(true);
          setRows(res.data);
        })
        .catch((error) => {
          setIsLoaded(true);
          setError(error);
        })
        setRefresh(false);
      }

      const saveOutOfOfficeDay = () => {
        let serviceCaller = new ServiceCaller();
        OutOfOfficeDayService.addOutOfOfficeDay(serviceCaller, { displayName: dayName, date: date })
        .then((res) => {
          if (res.status === 401) {
            toast.error("You are not authorized to create this day", { autoClose: 1000 })
            navigate('/', { replace: true });
            return
          } 

          if (res.status === 200) {
            toast.success("Created successfully", { autoClose: 1000 })
          } else {
            toast.error("An error occured while creating", { autoClose: 1000 })
          }

          setRefresh(true);
        })
        .catch((error) => {
          console.log(error)
          setIsLoaded(true);
          setError(error);
        })
      }
      const handleCreate=()=>{
          saveOutOfOfficeDay();
          setDayName("");
          handleCreateClose();
        }

      useEffect(() => {
        const serviceCaller = new ServiceCaller();
        JWTUtil.validateStorage(serviceCaller)
        .then((res) => {
          if(!res){
            navigate('/', { replace: true });
            return
          }

          if(!hasPermission(navigate)) return

          getOutOfOfficeDayData();
        })
        .catch((error) => {
          console.log(error)
          setError(error);
        })
      }, [refresh])


      const getMuiTheme = () =>
      createTheme({
          overrides: {
            MuiChip: {
              root: {
                backgroundColor: "pink"
              }
            }
          }
        });
        const columns = [
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
                    <Button aria-label="edit" onClick={()=>{handleUpdateOpen();loadDay(rows[dataIndex].id);setToUpdate(rows[dataIndex].id);}}><EditIcon style={{color:"#9e9e9e"}}></EditIcon></Button>
                  );
               }
              }
            }
          ];
    const handleDelete = () => {
      let serviceCaller = new ServiceCaller();
      OutOfOfficeDayService.deleteOutOfOfficeDay(serviceCaller, { ids: selectedIdList })
      .then((res) => {
        if (res.status === 401) {
          toast.error("You are not authorized to delete this day", { autoClose: 1000 })
          navigate('/', { replace: true });
          return
        }

        if (res.status === 200) {
          toast.success("Deleted successfully", { autoClose: 1000 })
        } else {
          toast.error("An error occured while deleting", { autoClose: 1000 })
        }

        setRefresh(true);
      })
      .catch((error) => {
        console.log(error)
        setError(error);
      })
    }   
    const options = {
            filterType: 'dropdown', 
              onRowSelectionChange: (currentSelect, allSelected) => {                   
              const result = allSelected.map(item => { return rows.at(item.index) });
              const selectedIds = result.map(item => {
                   return item.id;
              }); 
              setSelectedIdList(selectedIds);
        }, 
        onRowsDelete:()=>{handleDelete()},
    }
      if(error) {
        return <div> Error !!!</div>;
    } else if(!isLoaded) {
        return <div> Loading... </div>;} 
      else {
        return (
          <ThemeProvider theme={getMuiTheme()}>
            <h2>Out Of Office Day List</h2>
            <div>
            <Modal
              open={createOpen}
              onClose={handleCreateClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
              <Card sx={{margin:2, maxWidth: 500 }}>
            <CardHeader align="center" title="Add New Day"
            /> 
            <CardContent align="center">
              <TextField id="outlined-basic" label="Day Name" variant="outlined"  value={dayName} 
              onChange={(i)=>setDayName(i.target.value)} style={{marginBottom:15}}/>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  inputFormat="YYYY-MM-DD"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <div>
              <Button variant="outlined" onClick={()=> handleCreate()} style={{marginTop:15}}>Add</Button> 
              </div>
              <Typography variant="body2" color="text.secondary" align="left">
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
            </CardActions>
          </Card>
              </Box>
            </Modal>
          </div>
          <div>
            <Modal
              open={updateOpen}
              onClose={handleUpdateClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
              <Card sx={{margin:2, maxWidth: 500 }}>
            <CardHeader align="center" title="Edit Day"
            /> 
            <CardContent align="center">
              <TextField id="outlined-basic" label="Day Name" variant="outlined"  value={dayName} 
              onChange={(i)=>setDayName(i.target.value)}  style={{marginBottom:15}}/>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  inputFormat="YYYY-MM-DD"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <div>
              <Button variant="outlined" style={{marginLeft:30, marginTop:15}} onClick={()=> handleUpdate()}>Save</Button>
              </div> 
              <Typography variant="body2" color="text.secondary" align="left">
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
            </CardActions>
          </Card>
              </Box>
            </Modal>
          </div>
          <Divider/>
            <Button onClick={handleCreateOpen} variant="outlined" style={{margin:8, backgroundColor:"white", color:"black", borderColor:"white", textTransform: 'none'}}><AddCircleOutlineIcon></AddCircleOutlineIcon></Button>
            <MUIDataTable columns={columns} data={rows} options={options} />
          </ThemeProvider>
      );
      }
}

export default OutOfOfficeDayPage;
