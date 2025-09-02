import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { getLoggedInUserPath } from "@utils/helper";
import { useEffect } from "react";
import { Link, useOutletContext  } from "react-router-dom";
import b3 from "@assets/img/b3.png"

const Hero = () => {
 const { user, isAuthenticated, validateAuth} = useAuthStore();
    const { setChatOpen } = useOutletContext();

   useEffect(() => {
     const verifyAuth = async () => {
       await validateAuth(); // Ensure validateAuth works properly
     };
     verifyAuth();
   }, [validateAuth]);


  return (
   
  <section className="section-container mx-auto bg-bg-green dark:bg-gray-900 h-screen xs:h-[640px] md:h-[510px] lg:h-[490px] md:items-center justify-center flex items-start gap-4 flex-col-reverse md:flex-row">
  <div className="flex-1 flex flex-col gap-y-5">
    <h2 className="text-[24px] text-center md:text-left lg:text-[42px] font-[500] lg:leading-[50px] text-primary-text dark:text-white">
      Grow Your Real Estate Network <br /> List & Connect for Free
    </h2>
    <p className="leading-[29px] text-center md:text-left text-gray-700 dark:text-gray-300">
      Join Nigeria’s fastest-growing real estate marketplace! Network with
      top agents and industry experts, buy/sell effortlessly. List
      FREE—reach verified buyers & tenants nationwide. Start now in 30 secs!
    </p>
    <div className="flex items-center justify-center md:justify-start gap-x-4">
      <Link
        to={`${isAuthenticated ? getLoggedInUserPath(user) : paths.register}`}
        className="btn btn-cta btn-sm"
      >
        Get Started
      </Link>
       <button
            className="btn btn-primary btn-sm"
             onClick={() => setChatOpen(true)} 
          >
            Chat With Us
          </button>
    </div>
  </div>
  <div className="md:flex-1 w-full">
    <img
      src={b3}
      alt="Banner"
      className="w-[300px] mx-auto md:w-[450px] ml-auto object-cover"
    />
  </div>
</section>

  );
};

export default Hero;
