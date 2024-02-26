import type { AppProps } from "next/app";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react"
import { GoogleAnalytics } from '@next/third-parties/google'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
                <GoogleAnalytics gaId="G-F1JBCQ0MHY" />
            </SessionProvider>
            
        </>
    );
}

export default MyApp;