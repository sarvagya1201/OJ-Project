import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-200 dark:bg-zinc-800 text-center text-sm text-gray-700 dark:text-gray-300 py-4 mt-auto">
  <div className="max-w-4xl mx-auto px-4">
    <p>
      © {new Date().getFullYear()} Online Judge. Built with 💻 by Sarvagya Tiwari.
    </p>
    <p className="mt-1">
      <a
        href="https://github.com/sarvagya1201/OJ-Project"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        GitHub Repo
      </a>
    </p>
  </div>
</footer>

  )
}

export default Footer
