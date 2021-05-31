import Layout from '../components/Layout'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.bubble.css'; // CSS for Quill
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
