import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link ,useHistory } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { CustomersList } from "./components/CustomersList";
import { PackagesList } from "./components/PackagesList";
import { Invoices } from "./components/Invoices";
import { Invoice } from "./components/Invoice"

import "./App.css";

function App() {
  const [appData, setAppData] = useState({ customers: [], packages: [] });
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [customersInvoices, setCustomersInvoices] = useState({});
  const [newShippingOrder, setNewShippingOrder] = useState(0);
  const [invoicesCount, setInvoicesCount] = useState(0);

  const [menuEl, setMenuEl] = useState(null);
  const isMenuOpen = Boolean(menuEl);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data.json")
        .then((response) => response.json())
        .then((data) => {
          setAppData(data);
          setCustomers(data.customers);
          //Sorting packages list
          setPackages([...data.packages].sort((a,b) => {
            return a.shippingOrder - b.shippingOrder;
          }));
          setNewShippingOrder(data.packages.length+1);
        });
      };
      fetchData();
  },[]);

  const getCustomerName = (id) => {
    return customers.find(x => x.id === id).name;
  };

  const handleMenuClick = (event) => {
    setMenuEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuEl(null);
  };
  const handleDeleteCustomer = (id) => {
    let filtered = customers.filter(customer => {
      return customer.id !== id;
    });
    setCustomers(filtered);
  };

  const handleCreateInvoiceClick = (customerId,customerName) => {
    //1. create an array of data to use in the Invoice component
    const packagesItems = [];
    packagesItems["customerId"] = customerId;
    packagesItems["customerName"] = customerName;
    packagesItems["packages"] = packages.filter(pack => pack.customerid === customerId);
    packagesItems["invoiceId"] = (packagesItems["packages"].length>0) ? invoicesCount + 1 : "No packages for this Customer";
    packagesItems["hasInvoice"] = (packagesItems["packages"].length>0) ? true : "0 packages for this customer";
    packagesItems["sumWeight"] = (packagesItems["packages"].length>0) ? calculateWeight(packagesItems["packages"]) : "no packages weight";
    packagesItems["sumPrice"] = (packagesItems["packages"].length>0) ? calculatePrice(packagesItems["packages"]): "no packages price";
    setCustomersInvoices(packagesItems);

    //2. set the invoice counter for the invoice id
    setInvoicesCount(invoicesCount + 1);

    //3. set the customers again that if has invoice - couldn't create a new invoice for this customer
    //if doesn't have invoice and it will render these on the customers list
     const newCustomersList = [...customers].map((customer)=> {
       let hasInvoice = {};
       if(!customer.hasInvoice) {
         hasInvoice = ( customer.id === customerId) ? ({
           "packages": packagesItems["packages"],
           "invoiceId": invoicesCount + 1,
         }): false;
       } else {
         hasInvoice["packages"] = packagesItems["packages"];
         hasInvoice["invoiceId"] = invoicesCount + 1;
       }
       return ({...customer, hasInvoice})
     });
    setCustomers(newCustomersList);

    //4. update the invoices list for each invoice created
    const invoiceObject = {
      "id": invoicesCount + 1,
      "customerName": customerName,
      "packages":packagesItems,
      "totalWeight": packagesItems["sumWeight"],
      "sumPrice": packagesItems["sumPrice"],
    };
    const newInvoiceList = [...invoices];
    newInvoiceList.push(invoiceObject);
    setInvoices(newInvoiceList);
  };

  const handleDeletePackage = (id) => {
    let filteredPacks = packages.filter(pack => {
      return pack.id !== id;
    });
    setPackages(filteredPacks);
  };


  function handleAddPackage(newPackage) {
    let newPackagesList = [...packages];
    newPackagesList.push(newPackage);
    setPackages(newPackagesList);
  }

  const calculateWeight = (packageslist) => {
    let sum = 0;
    const newPackagesListSum = [...packageslist].map((pack)=> {
        let regex = "([0-9]+)";
        const newPackWeight = (pack.weight).match( regex );
        sum += parseInt(newPackWeight[0]);
    });
    return sum;
  };

  const calculatePrice = (packageslist) => {
    let sum = 0;
    if(packageslist.length>1){
      sum = [...packageslist].reduce((a, b) => ( a.price + b.price));
    } else{
      sum = packageslist[0].price;
    }
    return sum;
  };

  return (
    <Router>
      <div className="App">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={(event) => handleMenuClick(event)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Mail Delivery Service
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Switch>
          <Route exact path="/">
            Home page
          </Route>
          <Route path="/customers">
            <CustomersList
                customers={customers}
                handleCreateInvoiceClick={handleCreateInvoiceClick}
                handleDeleteCustomer={handleDeleteCustomer}></CustomersList>

          </Route>
          <Route path="/packages">
            <PackagesList
                packages={packages}
                newShippingOrder={newShippingOrder}
                handleDeletePackage={handleDeletePackage}
                handleAddPackage={handleAddPackage}></PackagesList>
          </Route>
          <Route path="/invoices">
            <Invoices invoices={invoices}></Invoices>
          </Route>
          <Route path="/invoice/:customerId">
            <Invoice customersInvoices={customersInvoices} render={(props) => <Invoice customersInvoices={customersInvoices} />}/>
          </Route>
        </Switch>
        <Drawer
          anchor={"left"}
          menuel={menuEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <List style={{ width: "300px" }}>
            <ListItem button component={Link} to="/Packages">
              <ListItemText primary={"Packages"} />
            </ListItem>
            <ListItem button component={Link} to="/Customers">
              <ListItemText primary={"Customers"} />
            </ListItem>
            <ListItem button component={Link} to="/Invoices">
              <ListItemText primary={"Invoices"} />
            </ListItem>
          </List>
        </Drawer>
      </div>
    </Router>
  );
}
export default App;
