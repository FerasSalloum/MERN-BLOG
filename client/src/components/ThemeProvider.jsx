import { useEffect } from "react";
import React from "react";
import { useSelector } from "react-redux";
const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme]);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};
export default ThemeProvider;
// -------------------------------
// import { , Card, DarkThemeToggle } from "flowbite-react";

// const ThemeProvider = () => {

//   return(<><DarkThemeToggle/>
//    <Card href="#" className="max-w-sm">
//       <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
//         Noteworthy technology acquisitions 2021
//       </h5>
//       <p className="font-normal text-gray-700 dark:text-gray-400">
//         Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
//       </p>
//     </Card></>) ;
// };

// export default ThemeProvider;
