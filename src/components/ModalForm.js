import React, {useEffect, useState} from "react";

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";

export const ModalForm = ({open, handleOpen, handleClose,newShippingOrder,handleAddPackage}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [packageid, setPackageid] = useState("");
  const [weight, setWeight] = useState(0);
  const [price, setPrice] = useState(0);
  const [customerId, setCustomerId] = useState(0);

  const handleSubmit = (event) =>{
   event.preventDefault();
   const newPackage = {id: packageid, customerid: parseInt(customerId),weight: parseInt(weight), price: parseInt(price),shippingOrder: newShippingOrder };
   handleAddPackage(newPackage);
   handleClose();
  };

  return (
    <div className="modal-form">
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add A Package in {newShippingOrder} shipping order
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
                style={{ width: "100%" , margin: "5px" }}
                type="text"
                name="pacakgeid"
                label="Package ID"
                variant="outlined"
                value={packageid}
                onChange={(e)=>setPackageid(e.target.value)}

            />
            <TextField
                style={{ width: "100%" , margin: "5px" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                type="text"
                label="Customer ID"
                name="customerid"
                variant="outlined"
                value={customerId}
                onChange={(e)=>setCustomerId(e.target.value)}

            />
            <TextField
                style={{ width: "100%" , margin: "5px" }}
                type="text"
                label="Weight"
                name="weight"
                variant="outlined"
                value={weight}
                onChange={(e)=>setWeight(e.target.value)}

            />
            <TextField
                style={{ width: "100%" , margin: "5px" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                type="text"
                label="Price"
                name="price"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}

            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
            >
              Add to List
            </Button>

          </form>

        </Box>
      </Modal>
    </div>
  );
};
