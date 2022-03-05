import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

export const Invoice = (props) => {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    const { customersInvoices } = props;
    let sum = 0;
    return (
        <div className="invoice">
            <Grid container spacing={2}>
                <Grid item xs></Grid>
                <Grid style={{textAlign:"left",fontWeight:"bold",marginTop: "60px",marginBottom: "30px"}} item xs={4}>
                    <div>Date: {date}</div>
                    <div>Customer Name: {customersInvoices.customerName}</div>
                </Grid>
                <Grid style={{textAlign:"right",fontWeight:"bold",marginTop: "60px",marginBottom: "30px"}} item xs={4}>
                    <div style={{fontWeight:"bold"}}> INVOICE</div>
                    <div>No. {customersInvoices.invoiceId}</div>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs></Grid>
                <Grid item xs={8}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} style={{border:"none"}} aria-label="simple table">
                            <TableHead>
                                <TableRow style={{border:"none"}}>
                                    <TableCell style={{fontWeight:"bold"}}>ID</TableCell>
                                    <TableCell style={{fontWeight:"bold"}}>WEIGHT</TableCell>
                                    <TableCell style={{backgroundColor:"lightgrey",fontWeight:"bold"}}>PRICE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{border:"none"}}>
                                {customersInvoices.packages.map((row, index) => {
                                    sum += row.price;
                                    return (
                                        <TableRow style={{border:"none"}} key={row.id}
                                                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >

                                            <TableCell  component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell>
                                                {row.weight}
                                            </TableCell>
                                            <TableCell style={{backgroundColor:"lightgrey"}}>
                                                {row.price}
                                            </TableCell>
                                        </TableRow>

                                    );
                                })}
                                <TableRow style={{border:"none"}}>
                                    <TableCell ></TableCell>
                                    <TableCell >{customersInvoices.sumWeight}kg</TableCell>
                                    <TableCell style={{backgroundColor:"lightgrey",fontWeight: "bold"}}>TOTAL: {sum}</TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </TableContainer>
                    <div className="disclaimer">
                        <div>
                            You received {(customersInvoices.packages).length} packages
                        </div>
                        <div>
                            Thank you for using our services
                        </div>
                    </div>
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        </div>
    );
};
