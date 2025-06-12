import { Link} from "react-router-dom";
import { motion as Motion } from "framer-motion";

const NotFound = () => {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-tertiary text-white relative overflow-hidden font-secondary"
    >
      {/* Glow Effect (using your accent color) */}
      <div className="absolute w-[500px] h-[500px] bg-radial-glow animate-float" />

      <div className="text-center z-10 p-8 max-w-md mx-auto">
        {/* 404 Title (using your primary font) */}
        <Motion.h1 
          className="text-8xl font-bold mb-4  bg-clip-text  "
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </Motion.h1>

        <p className="text-xl mb-2">
          Oops! <span className="orangeText font-semibold"> So Sorry You&quot;re here</span>
        </p>

        <p className="text-gray-400 mb-6 font-tertiary">
          The page you&quot;re looking for got lost in the digital void.
        </p>

        <Motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-block btn btn-primary btn-md "
          >
            Take Me Home
          </Link>
        </Motion.div>

        {/* Floating Emoji (now matches your theme) */}
        <Motion.span
          className="block text-5xl mt-6"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏨
        </Motion.span>
      </div>
    </Motion.div>
  );
};

export default NotFound;