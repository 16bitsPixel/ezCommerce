import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '@/context/Login';
import { Button, List, ListItem, ListItemText } from '@mui/material';

interface Key {
    id: string;
    key: string;
}

export const VendorKeys = () => {
  const [keys, setKeys] = useState<Key[]>([]);
  const loginContext = useContext(LoginContext);

  const createKey = () => {
    const mutation = {
      query: `mutation createKey($vendorId: String!) {
        createKey(vendorId: $vendorId)
      }`,
      variables: { vendorId: loginContext.userId },
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
      .catch((e) => {
        alert('Error creating new key: ' + e.message);
      });
  };

  useEffect(() => {
    const fetchKeys = () => {
      const query = {
        query: `query vendorkeys($vendorId: String!) {
        vendorkeys(vendorId: $vendorId) {
          id
          key
        }
      }`,
        variables: { vendorId: loginContext.userId },
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
            setKeys(json.data.vendorkeys);
          }
        })
        .catch((e) => {
          alert('Error fetching keys: ' + e.message);
        });
    };

    if (loginContext.userId) {
      fetchKeys();
    }
  }, [loginContext.userId, loginContext.accessToken]);

  return (
    <div>
      <List>
        {keys.map((key, index) => (
          <ListItem key={index}>
            <ListItemText primary={key.key} secondary={`ID: ${key.id}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={createKey}>
        Generate New Key
      </Button>
    </div>
  );
};
