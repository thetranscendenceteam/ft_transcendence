import React, { Suspense } from 'react'
import {Callback} from "@/components/callback"

function page() {
  return (
    <Suspense>
      <Callback/>
    </Suspense>
  )
}

export default page
