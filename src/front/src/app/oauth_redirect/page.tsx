"use client";
import React, { useEffect, useContext } from 'react'
import {getUser, User} from "@/lib/user"
import { useRouter, useSearchParams } from 'next/navigation';
import {UserContext} from "@/components/userProvider"

function Page(): JSX.Element {  
  const {user, updateUser} = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  var code: string = searchParams.get("code") as string;

  useEffect(() => {
    // Fetch data on the client side
    const fetchData = async () => {
      try {
        const response: User | any = await getUser(code); // Replace with your API route
        if (!response.error) {
        //  setData(response);
          window.sessionStorage.setItem("user", JSON.stringify(response));
          updateUser(response);
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  if (! user)
  {
    return (
      <div>
        Loading data...
      </div>
    )
  }
  return (
    <div>
    </div>
  )
}

export default Page
