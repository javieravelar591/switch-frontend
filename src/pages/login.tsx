import Head from "next/head";
import LoginModal from '../components/login';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Log In | Switch</title>
        <meta name="description" content="Log in to Switch to save your favorite brands and get personalized recommendations." />
      </Head>
      <LoginModal />
    </>
  );
}