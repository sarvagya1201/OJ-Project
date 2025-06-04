import React from "react";

const Footer = () => {
  return (
    <footer
      className="
        bg-white/20 dark:bg-zinc-900/20
        backdrop-blur-lg
        border-t border-white/25 dark:border-zinc-700/50
        text-center text-gray-700 dark:text-gray-300
        py-6 px-4
        mt-auto
        select-none
        transition-colors
        flex flex-col sm:flex-row justify-center items-center gap-3
      "
    >
      <p className="text-sm sm:text-base">
        © {new Date().getFullYear()} Algorun Judge. Built with{" "}
        <span role="img" aria-label="laptop">
          💻
        </span>{" "}
        by Sarvagya Tiwari.
      </p>

      <a
        href="https://github.com/sarvagya1201/OJ-Project"
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center gap-2
          text-blue-600 dark:text-blue-400
          hover:underline hover:text-blue-700 dark:hover:text-blue-500
          transition-colors
          text-sm sm:text-base
          font-semibold
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.43c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.75.08-.74.08-.74 1.21.09 1.84 1.24 1.84 1.24 1.08 1.85 2.84 1.32 3.54 1.01.11-.79.42-1.32.76-1.62-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.46 11.46 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.61-5.49 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        GitHub Repo
      </a>
    </footer>
  );
};

export default Footer;
