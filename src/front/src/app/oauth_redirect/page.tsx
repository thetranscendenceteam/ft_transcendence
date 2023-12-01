"use client";
import React, { useContext, useEffect, useState } from 'react'
import {getUser, User} from "@/lib/user"
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { UserContext } from '@/lib/Context';

function Page(): JSX.Element {  
  const [data, setData] = useState<User | any>(null);
  let user = useContext(UserContext);
  console.log("helleo: " + user);

  var searchParams = useSearchParams()
  var code: string = searchParams.get("code") as string;

  useEffect(() => {
    // Fetch data on the client side
    const fetchData = async () => {
      try {
        const response: User | any = await getUser(code); // Replace with your API route
        if (!response.error) {
          setData(response);
          window.sessionStorage.setItem("user", response);
        }
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  console.log(JSON.stringify(data));


  if (! data)
  {
    return (
      <div>
        Loading data...
      </div>
    )
  }
  return (
    <div>
      <h1>Welcome {data.username} !</h1>
      <Image src={data.avatar_url} unoptimized alt='avatar' width={100} height={100}/>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}

export default Page
