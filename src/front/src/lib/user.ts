"use server";
export type User = {
  id: string,
  username: string,
  realname: string | null,
  avatar_url: string | URL
}

async function fetchToken(code: string) {
  const payload: RequestInit =
    {
      method: 'POST',
      cache: 'no-cache', 
      body: JSON.stringify(
      {
        "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET,
        "code": code,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

  const staticData = await fetch(process.env.OAUTH_TOKEN_URL as string | URL, payload)
  var resj = await staticData.json();
  var res = resj.access_token ? resj.access_token : JSON.stringify(resj)
  return (res)
}

async function fetchUserData(token: string) {
  const payload: RequestInit =
    {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'Authorization': "Bearer " + token
      }
    }

  const res = await fetch(process.env.USERDATA_URL as string | URL, payload)
  return (res.text())
}

export async function getUser(code: string): Promise<Object> {
  let token: string = await fetchToken(code)
  if (! token.includes("error")) {
    let data = JSON.parse(await fetchUserData(token))
    let user: User = {
      id: data.id,
      username: data.login,
      realname: data.name,
      avatar_url: data.avatar_url
    }
    return (user)
  }
  return (JSON.parse(token))
}
