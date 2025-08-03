
import Hero from "@components/hero/Hero";
import Recent from "@components/recent/Recent";

const Homepage = () => {
  return (
    <>
      <div style={{width: "inherit"}}>
      <Hero />
      </div>
      <Recent/>
    </>
  );
};

export default Homepage;
