
import Hero from "@components/hero/Hero";
import FeaturedPostsHandler from "./FeaturedPostsHandler";

const Homepage = () => {
  return (
    <>
      <div style={{width: "inherit"}}>
      <Hero />
      </div>
      <FeaturedPostsHandler/>
    </>
  );
};

export default Homepage;
