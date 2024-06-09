import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "../styles/globals.css";

// React Toastify Popup
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// Components Header & Footer
import Footer from "../components/Others/Footer";
import Header from "../components/Others/Header";

// next auth Session Provider
import { SessionProvider } from "next-auth/react";
// Page Changing Loading Effect
import "nprogress/nprogress.css";


// React Context API
import { AppProps } from 'next/app';
import { ReactQueryClientProvider } from "../components/ReactQueryClientProvider";
import ContextProvider from "../context";

export default function App({ Component, pageProps }: AppProps) {

  

  return (
    <>
    <SessionProvider session={pageProps?.session}>
      <ReactQueryClientProvider>
        <ContextProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
          <ToastContainer />
        </ContextProvider>
      </ReactQueryClientProvider>
      
    </SessionProvider>
    
    </>
  );
}
