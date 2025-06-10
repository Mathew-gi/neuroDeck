import clsx from "clsx";
import "../styles/globals.css";
import { Inter, Comfortaa } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });
const comfortaa = Comfortaa({subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600", "700"], display: "swap"})

export default function App({ Component, pageProps }) {
  return (
    <div className={clsx(comfortaa.className, "text-slate-900 overflow-hidden")}>
      <Component {...pageProps} />
    </div>
  );
}
