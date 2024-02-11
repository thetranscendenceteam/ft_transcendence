"use client";

import User from '@/components/user';

function Page({ params }: { params: { username: string } }) {
  const inputUsername = params.username;
  return (
    <User username={inputUsername} />
  )
}

export default Page;