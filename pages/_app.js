import "../styles/globals.css";
import { useEffect } from "react";
function MyApp({ Component, pageProps }) {
  useEffect(async () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async function () {
        await navigator.serviceWorker
          .getRegistrations()
          .then(async function (registrations) {
            for (let registration of registrations) {
              console.log("unregistering....");
              await registration.unregister();
            }
            return;
          })
          .then(() => {
            navigator.serviceWorker.register("/sw.js").then(
              function (registration) {
                console.log(
                  "Service Worker registration successful with scope: ",
                  registration.scope
                );
              },
              function (err) {
                console.log("Service Worker registration failed: ", err);
              }
            );
          });
      });
    }
  }, []);
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
