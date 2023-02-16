import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, Divider, ThemeProvider, Button, Modal, Box, TextField } from "@mui/material";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ZoneService from 'services/zone/ZoneService';
import ServiceCaller from 'services/ServiceCaller';
import JWTUtil from "utils/jwtUtil";
import { hasPermission } from "utils/generalUtils";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import zonePageConfig from 'configs/zonePageConfig';

function ZonePage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [toUpdate, setToUpdate] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedIdList, setSelectedIdList] = useState([]);

  //params
  const [zone, setZone] = useState({
    zoneName: "",
    code: "",
    lowerBound: "",
    upperBound: "",
    price: "",
    transportChoice: "",
  });

  const { zoneName, code, lowerBound, upperBound, price, transportChoice } = zone;

  const onInputChange = (e, onlyNumber = false) => {
    const numberRegex = /^[0-9]*[.,]?[0-9]*$/;
    if (onlyNumber && !numberRegex.test(e.target.value)) return;

    setZone({ ...zone, [e.target.name]: e.target.value });
  }

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setZone({ zoneName: "", code: "", lowerBound: "", upperBound: "", price: "", transportChoice: ""});
  }

  const handleCreateClose = () => {
    setCreateOpen(false);
    setZone({ zoneName: "", code: "", lowerBound: "", upperBound: "", price: "", transportChoice: ""});
  }

  const validateFields = () => {
    if (zone.zoneName === "") {
      toast.error("Zone Name is required", { autoClose: 1000 });
      return false;
    }
    if (zone.code === "") {
      toast.error("Code is required", { autoClose: 1000 });
      return false;
    }
    if (zone.lowerBound === "") {
      toast.error("Lower Bound is required", { autoClose: 1000 });
      return false;
    }
    if (zone.upperBound === "") {
      toast.error("Upper Bound is required", { autoClose: 1000 });
      return false;
    }
    if (zone.price === "") {
      toast.error("Price is required", { autoClose: 1000 });
      return false;
    }
    if (zone.transportChoice === "") {
      toast.error("Transport Choice is required", { autoClose: 1000 });
      return false;
    }
    return true;
  }

  const prepareData = () => {
    zone.lowerBound = parseFloat(zone.lowerBound);
    zone.upperBound = parseFloat(zone.upperBound);
    zone.price = parseFloat(zone.price);
  }

  const loadZone = (id) => {
    const arr = rows.filter((row) => row.id === id);
    setZone({
      zoneName: arr[0].zoneName, 
      code: arr[0].code, 
      lowerBound: arr[0].lowerBound, 
      upperBound: arr[0].upperBound, 
      price: arr[0].price, 
      transportChoice: arr[0].transportChoice
    });
  }

  const handleCreate = () => {
    if (!validateFields()) return;
    prepareData();
    
    const serviceCaller = new ServiceCaller();
    ZoneService.addZone(serviceCaller, zone)
    .then((res) => {
      if (res.status === 200) {
        toast.success("Zone created successfully", { autoClose: 1000 });
        getZoneData();
        handleCreateClose();
      } else if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        navigate('/', { replace: true });
      } else {
        toast.error("Error creating zone", { autoClose: 1000 });
      }
    })
    .catch((error) => {
      console.log(error)
      toast.error("Error creating zone", { autoClose: 1000 });
    })
  }

  const handleUpdate = () => {
    if (!validateFields()) return;
    prepareData();

    const serviceCaller = new ServiceCaller();
    ZoneService.updateZone(serviceCaller, { id: toUpdate, ...zone })
    .then((res) => {
      if (res.status === 200) {
        toast.success("Zone updated successfully", { autoClose: 1000 });
        getZoneData();
        handleUpdateClose();
      } else if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        navigate('/', { replace: true });
      } else {
        toast.error("Error updating zone", { autoClose: 1000 });
      }
    })
    .catch((error) => {
      console.log(error)
      toast.error("Error updating zone", { autoClose: 1000 });
    })
  }

  const handleDelete = () => {
    const serviceCaller = new ServiceCaller();
    ZoneService.deleteZone(serviceCaller, { ids: selectedIdList })
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 200) {
        if (data.status === "SUCCESS") {
          toast.success("Zone deleted successfully", { autoClose: 1000 });
        } else {
          toast.error(data.message, { autoClose: 1000 });
        }
      } else if (res.status === 401) {
        toast.error("You are not authorized to access this page", { autoClose: 1000 });
        navigate('/', { replace: true });
        return
      } else {
        toast.error("Error deleting zone", { autoClose: 1000 });
      }

      getZoneData();
    })
    .catch((error) => {
      console.log(error)
      toast.error("Error deleting zone", { autoClose: 1000 });
    })
  }

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

  
  let columns = zonePageConfig.zonePageColumns;
  columns[columns.length - 1].options.customBodyRenderLite = (dataIndex) => {
    return (
      <Button aria-label="edit" onClick={() => { handleUpdateOpen(); loadZone(rows[dataIndex].id); setToUpdate(rows[dataIndex].id); }}><EditIcon style={{ color: "#9e9e9e" }}></EditIcon></Button>
    );
  }

  const getZoneData = () => {
    let serviceCaller = new ServiceCaller();
    ZoneService.getZones(serviceCaller, '')
      .then((res) => {
        if (res.status === 200) {
          setIsLoaded(true);
          setRows(res.data);
        }

        if (res.status === 401) {
          toast.error("You are not authorized to access this page", { autoClose: 1000 });
          navigate('/', { replace: true });
          return
        }
      })
      .catch((error) => {
        console.log(error)
        setIsLoaded(true);
        setError(error);
      })
  }

  useEffect(() => {
    const serviceCaller = new ServiceCaller();
    JWTUtil.validateStorage(serviceCaller)
      .then((res) => {
        if (!res) {
          navigate('/', { replace: true });
          return
        }

        if (!hasPermission(navigate)) return

        getZoneData();
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const options = {
    filterType: 'dropdown',
    onRowSelectionChange: (currentSelect, allSelected) => {
      const result = allSelected.map(item => { return rows.at(item.index) });
      const selectedIds = result.map(item => {
        return item.id;
      });
      setSelectedIdList(selectedIds);
    },
    onRowsDelete: () => handleDelete(),
  }

  if (error) {
    return <div> Error !!!</div>;
  } else if (!isLoaded) {
    return <div> Loading... </div>;
  }
  else {
    return (
      <ThemeProvider theme={getMuiTheme()}>
        <h2>Zone List</h2>
        <Divider />
        <Button variant="outlined" style={{ margin: 8, backgroundColor: "white", color: "black", borderColor: "white", textTransform: 'none' }} onClick={() => handleCreateOpen()}><AddCircleOutlineIcon></AddCircleOutlineIcon></Button>
        <MUIDataTable columns={columns} data={rows} options={options} />
        <div>
          <Modal
            open={createOpen}
            onClose={handleCreateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={zonePageConfig.style}>
              <Card sx={{ margin: 2, maxWidth: 500 }}>
                <CardHeader align="center" title="Edit Zone" />
                <CardContent align="center">
                  <TextField id="outlined-basic" name="zoneName" label="Zone Name" variant="outlined"
                    value={zoneName}
                    onChange={(e) => onInputChange(e)} 
                    />

                  <TextField id="outlined-basic" name="code" label="Zone Code" variant="outlined" 
                    value={code}
                    onChange={(e) => onInputChange(e)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="lowerBound" label="Lower Bound" variant="outlined"
                    value={lowerBound}
                    onChange={(e) => onInputChange(e, true)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="upperBound" label="Upper Bound" variant="outlined" 
                    value={upperBound}
                    onChange={(e) => onInputChange(e, true)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="price" label="Price" variant="outlined" 
                    value={price}
                    onChange={(e) => onInputChange(e, true)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="transportChoice" label="Transportation" variant="outlined" 
                    value={transportChoice}
                    onChange={(e) => onInputChange(e)} 
                    sx={{ mt: 1.5 }}
                  />
                  <div>
                    <Button variant="outlined" style={{ marginLeft: 30, marginTop: 10 }} onClick={() => handleCreate()}>Create</Button>
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
            <Box sx={zonePageConfig.style}>
              <Card sx={{ margin: 2, maxWidth: 500 }}>
                <CardHeader align="center" title="Edit Zone" />
                <CardContent align="center">
                  <TextField id="outlined-basic" name="zoneName" label="Zone Name" variant="outlined"
                    value={zoneName}
                    onChange={(e) => onInputChange(e)} 
                    />

                  <TextField id="outlined-basic" name="code" label="Zone Code" variant="outlined" 
                    value={code}
                    onChange={(e) => onInputChange(e)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="lowerBound" label="Lower Bound" variant="outlined"
                    value={lowerBound}
                    onChange={(e) => onInputChange(e, true)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="upperBound" label="Upper Bound" variant="outlined" 
                    value={upperBound}
                    onChange={(e) => onInputChange(e, true)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="price" label="Price" variant="outlined" 
                    value={price}
                    onChange={(e) => onInputChange(e, true)} 
                    sx={{ mt: 1.5 }}
                  />

                  <TextField id="outlined-basic" name="transportChoice" label="Transportation" variant="outlined" 
                    value={transportChoice}
                    onChange={(e) => onInputChange(e)} 
                    sx={{ mt: 1.5 }}
                  />
                  <div>
                    <Button variant="outlined" style={{ marginLeft: 30, marginTop: 10 }} onClick={() => handleUpdate()}>Save</Button>
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
      </ThemeProvider>
    )
  }
}

export default ZonePage;
