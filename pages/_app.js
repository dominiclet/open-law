import Layout from '../components/Layout';
import NoNavbarLayout from '../components/NoNavbarLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.bubble.css'; // CSS for Quill
import '../styles/globals.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Paths that do not require authentication
  const noAuth = ["/login", "/register"];
  if (noAuth.includes(router.pathname)) {
    return (
      <NoNavbarLayout>
        <Component {...pageProps} />
      </NoNavbarLayout>
    );
  }

  return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
  );
}

export default MyApp
