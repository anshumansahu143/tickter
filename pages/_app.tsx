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


import { ReactQueryClientProvider } from "../components/ReactQueryClientProvider";
import ContextProvider from "../context";

export default function App({ Component, pageProps }:any) {

  
  console.log(pageProps?.session);
  return (
    <>
    <SessionProvider session={pageProps?.session}>
      
        <ContextProvider>
          <ReactQueryClientProvider>
            <Header />
            <Component {...pageProps} className="min-h-[100vh]" />
            <Footer />
            <ToastContainer />
          </ReactQueryClientProvider>
        </ContextProvider>
      
      
    </SessionProvider>
    
    </>
  );
}
