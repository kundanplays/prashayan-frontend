import { redirect } from 'next/navigation';

// Server-side redirect - this should work immediately
export default function HomeRedirect() {
    redirect('/');
}