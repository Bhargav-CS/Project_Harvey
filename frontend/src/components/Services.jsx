/*
import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style }} onClick={onClick}>
      <img src={"./Next_icon.svg"} alt="" className="w-2.5" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <img src={"./previous_icon.svg"} alt="previous" className="w-2.5" />
    </div>
  );
}

const settings_first = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        arrows: true,
        dots: false,
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        dots: false,
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        arrows: false,
        slidesToShow: 1,
        dots: true,
      },
    },
  ],
};

// Popular Services Data
let popularcatData = [
  {
    title: "AI Chatbot",
    des: "Get instant legal guidance with our AI-powered chatbot. Quick, reliable, and available 24/7 to assist you with legal queries.",
    img: "./ai_chatbot.jpg",
    link: "/chatbot", // Update this with the correct URL
  },
  {
    title: "Community Platform",
    des: "Join our legal community! Connect with experts, ask questions, and share insights in a professional legal network.",
    img: "./community_platform.jpg",
    link: "/community-platform", // Update this with the correct URL
  },
  {
    title: "Consultancy Services",
    des: "Need expert legal advice? Our consultancy services provide professional guidance tailored to your legal needs.",
    img: "./consultancy_services.jpg",
    link: "/consultancy-services", // Update this with the correct URL
  },
];

const Services = () => {
  const navigate = useNavigate();

  function serviceHandler() {
    navigate("/services");
  }

  return (
    <div>
      {/* Popular Services Section }
      <div className="mt-5 md:mt-14 flex flex-col items-center gap-6 lg:gap-14 md:gap-7">
        <div className="lg:text-[40px] text-[28px] md:text-[30px] leading-[68px] tracking-[0.02em] text-[#1C1C23] font-semibold">
          Popular Services
        </div>
        <div className="flex md:flex-row xl:gap-12 md:px-[2%] md:gap-7 lawyers">
          <Slider {...settings_first}>
            {popularcatData.map((data, index) => (
              <div key={index} className="w-full flex justify-center">
                <a
                  href={data.link}
                  className="relative bg-black rounded-[8px] w-full min-h-[377px] flex justify-center items-end cursor-pointer"
                >
                  {/* Background Overlay }
                  <div
                    style={{
                      backgroundImage: `url(${data.img})`,
                      backgroundSize: "cover",
                    }}
                    className="w-full absolute rounded-[8px] bg-black opacity-[0.4] min-h-[377px] h-full"
                  ></div>

                  {/* Content }
                  <div className="rounded-[8px] absolute z-10 flex flex-col xl:gap-7 lg:gap-2.5 md:gap-3.5 top-7 left-11 pr-2">
                    <div className="xl:text-[32px] lg:text-[28px] text-xl md:text-[30px] text-start leading-[48px] text-white font-semibold">
                      {data.title}
                    </div>
                    <div className="lg:max-w-fit max-w-xs xl:max-w-fit md:max-w-fit pr-0 md:pr-[20%] lg:pr-[15%] text-justify text-white lg:text-xl text-lg md:leading-[32px] lg:leading-7 font-normal">
                      {data.des}
                    </div>
                    <div className="flex items-center gap-4 text-[#DDA45C] text-start lg:text-xl text-lg leading-7 font-medium cursor-pointer w-fit">
                      <span>Explore</span>
                      <div className="flex items-center">
                        <img src={"/assets/advocate/Cat_arrow.svg"} alt="" />
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </Slider>
        </div>
        <div>
          <div
            onClick={serviceHandler}
            className="px-[24px] text-white leading-6 tracking-[0.02em] font-normal py-2.5 bg-[#DDA45C] rounded-[6px] mt-10 sm:mt-0 cursor-pointer"
          >
            <button className="text-base">All Services</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
*/
import React from "react";
import Dashboard from "./Dashboard";


const Services = () => {
  return (
    <div className="services-page">
      <h1 className="text-center text-3xl font-bold my-4">Our Services</h1>
      <Dashboard />
    </div>
  );
};

export default Services;
