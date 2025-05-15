import useDarkMode from "../hooks/useDarkMode";
import { Moon, Sun } from "lucide-react"; // optional icons if you're using lucide-react

const ThemeToggle = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition hover:bg-gray-300 dark:hover:bg-zinc-700"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
    </button>
  );
};

export default ThemeToggle;
