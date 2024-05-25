/*
#######################################################################
#
# Copyright (C) 2020-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import React from 'react';
import { useState } from 'react';
import TopBar from './Topbar';
import { LoginContext } from '../context/Login'
import PendingVendors from './pending';

export interface Vendor{
  id: number,
  name: string
}
const getPendingVendors = (setpendingVendors:React.Dispatch<React.SetStateAction<Vendor[]>>, accessToken:string) => {
  const query = {query: `query pendingVendors { getpendingVendors {vendorId,name}}`}
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      if (json.errors) {
        console.log(`Getting penfing vendros caused an error from the backend`);
        console.log(json);
      } else {
        console.log(json.data.getpendingVendors)
        setpendingVendors(json.data.getpendingVendors);
      }
    })
}

export function Home() {
  const loginContext = React.useContext(LoginContext)
  const [pendingvendors, setpendingVendors] = useState<Vendor[]>([]);
  React.useEffect(() => {
    getPendingVendors(setpendingVendors,loginContext.accessToken);
  }, [loginContext.accessToken]);

  if (loginContext.accessToken.length > 0) {
    return (
      <div>
        <TopBar/>
        <PendingVendors initialVendors={pendingvendors} />
      </div>
    )
  }
  else {
    return null
  }
}
