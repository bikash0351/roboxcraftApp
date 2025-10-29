
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer needed as login and signup are unified.
// Redirect any traffic to the new login page.
export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
