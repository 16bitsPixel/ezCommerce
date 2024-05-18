import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

let id = 0;
function createData(productName:any, buyerEmail:any, price:any, orderStatus:any) {
  id += 1;
  return { id, buyerEmail, productName, price, orderStatus};
}



const data = [
  createData('Computer', 'Bob@gmail.com', '$999.99', 'Shipped'),
  createData('Table', 'Eric@gmail.com', '$150.00', 'Delivered'),
  createData('Headphones', 'George@gmail.com', '$125.99', 'Delivered'),
];

function SimpleTable() {
  return (
    <Paper className="root">
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell>Buyer Email</TableCell>
            <TableCell align="right">Product Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Order Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => (
            <TableRow key={n.id}>
              <TableCell component="th" scope="row">{n.buyerEmail}</TableCell>
              <TableCell align="right">{n.productName}</TableCell>
              <TableCell align="right">{n.price}</TableCell>
              <TableCell align="right">{n.orderStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SimpleTable;
