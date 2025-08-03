
import { useTheme } from '@context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ToggleSwitch = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center justify-between w-16 h-8 rounded-full p-1 bg-gray-200 dark:bg-gray-700 relative transition-colors duration-300"
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      <FiSun className={`text-yellow-500 ${darkMode ? 'opacity-50' : 'opacity-100'}`} />
      <FiMoon className={`text-blue-400 ${darkMode ? 'opacity-100' : 'opacity-50'}`} />
      <span
        className={`absolute w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 ${
          darkMode ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;