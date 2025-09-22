const BreadcrumbNav = ({ baseNave, firstPath, firstPathTitle, secondPathTitle }) => {
  return (
    <div className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-sm"
              >
                {baseNave}
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
                <a
                  href={firstPath}
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-sm"
                >
                  {firstPathTitle}
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium capitalize">
                  {secondPathTitle}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default BreadcrumbNav;
