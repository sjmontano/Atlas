import { useState } from "react";
import Header from "../components/Header";
import Content from "../components/Content";




export const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  return (

    <div className="home">
      <Header toggleSidebar={toggleSidebar} />
      <Content toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Home;
