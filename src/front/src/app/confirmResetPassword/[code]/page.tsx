"use client";

import React from 'react'
import ConfirmResetPasswordForm from '@/components/confirmResetPassword';

function page({ params }: { params: { code: string } }) {
  const code = params.code;
  return (
    <ConfirmResetPasswordForm code={code} />
  )
}

export default page;