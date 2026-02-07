'use client';

import { ReactNode, useEffect } from 'react';
import ToastContainer from '@/components/toast-container';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}