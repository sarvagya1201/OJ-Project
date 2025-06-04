import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
 <div
      className="App flex flex-col min-h-screen 
                bg-white text-black 
                dark:bg-zinc-900 dark:text-white 
                scrollbar scrollbar-thumb-zinc-600 scrollbar-track-zinc-200 
                dark:scrollbar-thumb-zinc-400 dark:scrollbar-track-zinc-800 
                scrollbar-thumb-rounded-full"
    >
      <Header />

      <div className="flex-grow pt-16 ">
        <AppRoutes />
      </div>

      <Footer />
    </div>
  );
}

export default App;
