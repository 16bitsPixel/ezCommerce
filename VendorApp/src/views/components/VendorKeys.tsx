import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '@/context/Login';
import { Button, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
interface Key {
    id: string;
    key: string;
}

export const VendorKeys = () => {
  const [keys, setKeys] = useState<Key[]>([]);
  const loginContext = useContext(LoginContext);
  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const createKey = () => {
    const mutation = {
      query: `mutation newkey{createKey{id,key}}`,
    };
    fetch('/vendor/api/graphql', {
      method: 'POST',
      body: JSON.stringify(mutation),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginContext.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors) {
          alert(json.errors[0].message);
        } else {
          setKeys([...keys, json.data.createKey]);
        }
      })
  };

  useEffect(() => {
    const fetchKeys = () => {
      const query = {
        query: `query keys {
          allkeys { id, key }
        }`,
      };
      fetch('/vendor/api/graphql', {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginContext.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.errors) {
            alert(json.errors[0].message);
          } else {
            setKeys(json.data.allkeys);
          }
        })
    };

    if (loginContext.accessToken) {
      fetchKeys();
    }
  }, [loginContext.accessToken]);

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="api keys table">
              <TableHead>
                <TableRow>
                  <TableCell>API Key</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keys.map((key, index) => (
                  <TableRow key={index}>
                    <TableCell>{key.key.length > 10 ? `${key.key.substring(0, 50)}...` : key.key}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => copyToClipboard(key.key)} aria-label="copy">
                        <ContentCopyIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="primary" onClick={createKey}>
             Generate New Key
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
