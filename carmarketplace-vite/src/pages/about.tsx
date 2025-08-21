// AboutRedirect.tsx
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.location.replace("https://github.com/kevinxue2/carmarketplace/tree/main");
  }, []);

  return null; // nothing to render
};

export default About;