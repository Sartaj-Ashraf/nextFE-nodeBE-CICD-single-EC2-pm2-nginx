"use client";
import { useState } from "react";
import { Code, Globe, Users } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
const About = () => {
  const [activeTab, setActiveTab] = useState("skills");

  const tabs = [
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ];

  const skills = [
    {
      name: "Web Development",
      icon: <Code className="text-indigo-600" size={24} />,
      description:
        "Building responsive and dynamic web applications with modern frameworks and technologies.",
    },
    {
      name: "User Experience",
      icon: <Users className="text-indigo-600" size={24} />,
      description:
        "Creating intuitive and seamless user experiences that delight and engage.",
    },
    {
      name: "Full Stack Solutions",
      icon: <Globe className="text-indigo-600" size={24} />,
      description:
        "Developing end-to-end solutions from database design to frontend implementation.",
    },
  ];

  const experiences = [
    {
      title: "Senior Developer",
      company: "TechCorp",
      period: "2021 - Present",
      description:
        "Leading development of enterprise web applications using React and Node.js.",
    },
    {
      title: "Web Developer",
      company: "Digital Solutions Inc",
      period: "2018 - 2021",
      description:
        "Built responsive web applications and implemented backend services.",
    },
  ];

  const education = [
    {
      degree: "Master of Computer Science",
      institution: "Kashmir University",
      period: "2016 - 2018",
      description: "Specialized in Web Technologies and Software Engineering",
    },
    {
      degree: "Bachelor of Technology",
      institution: "NIT Srinagar",
      period: "2012 - 2016",
      description: "Computer Science and Engineering",
    },
  ];

  return (
    <section
      id="about"
      className="py-24"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="About Me"
          heading="Bringing Ideas to Life"
          subHeading="I craft elegant solutions to complex problems through code, design and innovation."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="bg-black border-gray-700 border-1 shadow-xl rounded-2xl p-8 relative z-10">
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Hello! I'm{" "}
                    <span className="font-semibold text-indigo-600">
                      Sartaj Ashraf
                    </span>
                    , a Full Stack Developer based in Pulwama, Srinagar, India.
                    I specialize in building exceptional digital experiences
                    that combine beautiful design with powerful functionality.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed mt-4">
                    With a strong foundation in both frontend and backend
                    technologies, I create web applications that are not only
                    visually appealing but also performant and scalable. My
                    approach focuses on writing clean, maintainable code and
                    delivering solutions that exceed client expectations.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed mt-4">
                    When I'm not coding, you can find me exploring new
                    technologies, contributing to open-source projects, or
                    enjoying the beautiful landscapes of Kashmir.
                  </p>
                </div>
              </div>
              <div className="hidden lg:block absolute inset-0 bg-indigo-100 rounded-2xl transform -rotate-3 z-0"></div>
            </div>
          </div>

          <div className="order-1 lg:order-2 bg-black border-gray-700 border-1 shadow-xl rounded-2xl p-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 ">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-2 border-b-2 font-medium text-sm cursor-pointer   ${
                      activeTab === tab.id
                        ? "border-white text-white"
                        : "border-transparent text-gray-400 hover:text-white hover:border-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === "skills" && (
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-black border-gray-700 border-1 rounded-xl p-6 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-700 p-3 rounded-lg">
                          {skill.icon}
                        </div>
                        <div className="text-white">
                          <h3 className="text-xl font-semibold text-white">
                            {skill.name}
                          </h3>
                          <p className="mt-2 text-gray-400">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "experience" && (
                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative pl-8 pb-8">
                      {index !== experiences.length - 1 && (
                        <div className="absolute top-0 left-3 h-full w-0.5 bg-gray-700"></div>
                      )}
                      <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-gray-700 border-4 border-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {exp.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{exp.company}</span>
                          <span className="mx-2">•</span>
                          <span>{exp.period}</span>
                        </div>
                        <p className="mt-2 text-gray-400">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-8">
                  {education.map((edu, index) => (
                    <div key={index} className="relative pl-8 pb-8">
                      {index !== education.length - 1 && (
                        <div className="absolute top-0 left-3 h-full w-0.5 bg-indigo-100"></div>
                      )}
                      <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{edu.institution}</span>
                          <span className="mx-2">•</span>
                          <span>{edu.period}</span>
                        </div>
                        <p className="mt-2 text-gray-400">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
