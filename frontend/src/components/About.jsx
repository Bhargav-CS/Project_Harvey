import React from "react";

const teamMembers = [
  {
    name: "Shantanu Modhave",
    number: "21BCE10106",
    role: "Works on integration and web",
    img: "./shantanu.jpg",
  },
  {
    name: "Bhargav Patki",
    number: "21BCE10552",
    role: "Works on LLM models",
    img: "./bhargav2.jpg",
  },
  {
    name: "Mudit Gaur",
    number: "21BCE10244",
    role: "Works on design and project architecture",
    img: "./lawyer_three.png",
  },
  {
    name: "Mudita Pathak",
    number: "21BCE10580",
    role: "Works on all data-related tasks",
    img: "./mudita.jpg",
  },
  {
    name: "Shruti Sijariya",
    number: "21BCE10688",
    role: "Works on all data-related tasks",
    img: "./shruti.jpg",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gray-100 w-full">
      <h1 className="text-3xl font-semibold mb-8">Meet Our Team</h1>

      {/* Shantanu Alone on Top */}
      <div className="w-full max-w-4xl px-4 flex flex-col items-center mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center w-full">
          {/* Circular Image */}
          <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-gray-300">
            <img src={teamMembers[0].img} alt={teamMembers[0].name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold mt-4">{teamMembers[0].name}</h2>
          <p className="text-gray-600">{teamMembers[0].number}</p>
          <p className="text-gray-700">{teamMembers[0].role}</p>
        </div>
      </div>

      {/* Remaining Members in Two-Column Grid */}
      <div className="w-full max-w-4xl px-4 grid grid-cols-2 gap-6">
        {teamMembers.slice(1).map((member, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
            {/* Circular Image */}
            <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-gray-300">
              <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-semibold mt-4">{member.name}</h2>
            <p className="text-gray-600">{member.number}</p>
            <p className="text-gray-700">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About ;
