import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { getAuthOptions } from './api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await unstable_getServerSession(req, res, getAuthOptions(req)),
    },
  };
};

const Home: NextPage = () => {
  const { status } = useSession();
  const prevStatus = useRef(status);
  const router = useRouter();

  useEffect(() => {
    console.log({
      prev: prevStatus.current,
      curr: status,
    });

    if (
      prevStatus.current === 'unauthenticated' &&
      status === 'authenticated'
    ) {
      router.push('/restricted');
    }
    prevStatus.current = status;
  }, [status]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <header>
          <ConnectButton />
        </header>
      </div>

      <h1>Home Page</h1>
      {status === 'authenticated' ? (
        <Link href="/restricted">Restricted</Link>
      ) : null}
    </>
  );
};

export default Home;
