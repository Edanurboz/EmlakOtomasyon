import React, { useEffect, useState } from "react";
import Countup from "react-countup";
import { LiaCertificateSolid } from "react-icons/lia";
const Achievements = () => {
  const [isVisible, setIsVisible] = useState(false);

  const statistics = [
    { label: "Happy clients", value: "12" },
    { label: "Different cities", value: "3" },
    { label: "Projects completed", value: "45" },
  ];

  useEffect(()=>{
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const top = aboutSection.getBoundingClientRect();
        const isVisible = top < window.innerHeight - 100;
        setIsVisible(isVisible);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  },[]);

  return (
    <section id="about" className="mx-auto max-w-[1440px] 2xl:max-w-[1920px]">
      {/* CONTAINER */}
      <div className="flex flex-col xl:flex-row">
        {/* LEFT SIDE */}
        <div className="flex-[6] flex justify-center flex-col bg-[#008274] text-white px-6 lg:px-12 py-16">
          <h2 className="h2">Our Achievements</h2>
          <p className="py-5 text-white max-w-[47rem]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati
            officiis numquam cupiditate velit?
          </p>
          {/* STATISTICS CONTAINER */}
          <div className="flex flex-wrap gap-4">
            {statistics.map((statistic, index) => (
              <div key={index} className="p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <Countup start={isVisible ? 0 : null} end={statistic.value} duration={10} delay={1}>
                    {({countUpRef})=>( 
                      <h3 ref={countUpRef} className="text-5xl font-sans"></h3>
                    )}
                  </Countup>
                  <h4 className="regular-32">k+</h4>
                </div>
                <p className="text-white capitalize pt-2">{statistic.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-[2] relative bg-primary px-6 lg:px-12 py-16 flexCenter">
          <div className="p-4 rounded-lg flexCenter flex-col xl:flex-col">
            <span className="relative bottom-8 p-3 flex items-center rounded-full"><LiaCertificateSolid className="text-5xl text-black"/></span>
            <span className="relative bottom-3">Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
