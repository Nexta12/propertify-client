import React from 'react'

const Breadcrumb = () => {
  return (
    <div className=" py-3 px-4 border-b">
            <div className="container mx-auto">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <a
                      href="/"
                      className="text-gray-700 hover:text-indigo-600 text-sm"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="text-gray-400 mx-2">/</span>
                      <span className="text-indigo-600 text-sm font-medium">
                        Properties
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
  )
}

export default Breadcrumb