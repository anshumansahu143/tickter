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

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ReactQueryClientProvider } from "../components/ReactQueryClientProvider";
import ContextProvider from "../context";
import Head from "next/head";

export default function App({ Component, pageProps }:any) {

  
  console.log(pageProps?.session);
  return (
    <>
    <SessionProvider session={pageProps?.session}>
      
        <ContextProvider>
          <ReactQueryClientProvider>
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <Component {...pageProps} className="min-h-[100vh]" />
            <Footer />
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryClientProvider>
        </ContextProvider>
      
      
    </SessionProvider>
    
    </>
  );
}
