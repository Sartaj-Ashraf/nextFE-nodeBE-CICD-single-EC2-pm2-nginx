"use client";
import { useState, useRef, useEffect } from "react";
import { 
  Code, 
  Globe, 
  Users, 
  Award, 
  Coffee, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Sparkles
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const About = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: <Users size={16} /> },
    { id: "skills", label: "Skills", icon: <Code size={16} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={16} /> },
  ];

  const personalStats = [
    { number: "50+", label: "Projects Completed", icon: <Award className="text-cyan-400" size={20} /> },
    { number: "3+", label: "Years Experience", icon: <Calendar className="text-green-400" size={20} /> },
    { number: "100%", label: "Client Satisfaction", icon: <Star className="text-yellow-400" size={20} /> },
    { number: "24/7", label: "Availability", icon: <Coffee className="text-orange-400" size={20} /> },
  ];

  const techStack = [
    { name: "React.js", level: 95, color: "from-blue-500 to-cyan-500" },
    { name: "Node.js", level: 90, color: "from-green-500 to-emerald-500" },
    { name: "MongoDB", level: 85, color: "from-green-600 to-green-400" },
    { name: "Express.js", level: 88, color: "from-gray-600 to-gray-400" },
    { name: "JavaScript", level: 92, color: "from-yellow-500 to-orange-500" },
    { name: "TypeScript", level: 80, color: "from-blue-600 to-indigo-500" },
    { name: "Next.js", level: 85, color: "from-gray-900 to-gray-700" },
    { name: "Tailwind CSS", level: 90, color: "from-cyan-500 to-blue-500" },
  ];

  const skills = [
    {
      name: "Full Stack Development",
      icon: <Globe className="text-cyan-400" size={24} />,
      description: "Building scalable web applications with modern MERN stack technologies and cloud deployment.",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      name: "Frontend Excellence",
      icon: <Code className="text-purple-400" size={24} />,
      description: "Creating stunning, responsive user interfaces with cutting-edge frameworks and design systems.",
      tags: ["React", "Next.js", "Tailwind", "TypeScript"],
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      name: "User Experience Design",
      icon: <Users className="text-green-400" size={24} />,
      description: "Crafting intuitive user experiences that drive engagement and conversion through thoughtful design.",
      tags: ["UI/UX", "Figma", "Prototyping", "Testing"],
      gradient: "from-green-500/20 to-emerald-500/20"
    },
  ];

  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Oasis Ascend",
      location: "Srinagar, J&K",
      period: "2023 - Present",
      type: "Full-time",
      description: "Leading development of modern web applications using MERN stack. Collaborating with cross-functional teams to deliver high-quality digital solutions for clients across various industries.",
      achievements: [
        "Developed 20+ responsive web applications",
        "Improved application performance by 40%",
        "Mentored junior developers on best practices",
        "Implemented CI/CD pipelines for faster deployment"
      ],
      technologies: ["React", "Node.js", "MongoDB", "Express", "AWS"],
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      title: "Frontend Developer",
      company: "Red Stag Labs",
      location: "Remote",
      period: "2022 - 2023",
      type: "Contract",
      description: "Specialized in creating responsive and interactive user interfaces for web applications using modern frontend technologies.",
      achievements: [
        "Built pixel-perfect UI components",
        "Optimized frontend performance",
        "Collaborated with design teams",
        "Implemented responsive design patterns"
      ],
      technologies: ["React", "JavaScript", "CSS3", "HTML5"],
      gradient: "from-cyan-500 to-blue-600"
    },
  ];

  const education = [
    {
      degree: "Master of Computer Applications",
      institution: "University of Kashmir",
      location: "Srinagar, J&K",
      period: "2020 - 2022",
      grade: "First Division",
      description: "Specialized in Advanced Web Technologies, Software Engineering, and Database Management Systems.",
      subjects: ["Web Development", "Software Engineering", "Database Systems", "Data Structures"],
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      degree: "Bachelor of Computer Applications",
      institution: "University of Kashmir",
      location: "Srinagar, J&K",
      period: "2017 - 2020",
      grade: "First Division",
      description: "Foundation in Computer Science with focus on Programming, Web Technologies, and System Analysis.",
      subjects: ["Programming", "Web Technologies", "System Analysis", "Mathematics"],
      gradient: "from-blue-500 to-indigo-600"
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="text-cyan-400" size={16} />
            <span className="text-cyan-400 text-sm font-medium">About Me</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Crafting Digital
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Experiences
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Passionate Full Stack Developer from the beautiful valleys of Kashmir, 
            turning innovative ideas into exceptional digital solutions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Profile Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              {/* Profile Image & Info */}
              <div className="relative group mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-1 mx-auto">
                        <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                          <span className="text-4xl font-bold text-white">SA</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 animate-pulse"></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Sartaj Ashraf</h3>
                    <p className="text-cyan-400 font-medium mb-4">Full Stack Developer</p>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                      <MapPin size={16} />
                      <span>Srinagar, Kashmir, India</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4 mb-8">
                      {[
                        { icon: <Github size={20} />, color: "hover:text-gray-300" },
                        { icon: <Linkedin size={20} />, color: "hover:text-blue-400" },
                        { icon: <Mail size={20} />, color: "hover:text-cyan-400" }
                      ].map((social, index) => (
                        <button
                          key={index}
                          className={`p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:border-cyan-500/50`}
                        >
                          {social.icon}
                        </button>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      {personalStats.map((stat, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 text-center hover:border-cyan-500/50 transition-all duration-300"
                        >
                          <div className="flex justify-center mb-2">{stat.icon}</div>
                          <div className="text-xl font-bold text-white">{stat.number}</div>
                          <div className="text-xs text-gray-400 leading-tight">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="lg:col-span-8">
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Bio Section */}
                  <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Users className="text-cyan-400" size={24} />
                      Who Am I?
                    </h3>
                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                      <p>
                        Hello! I'm <span className="font-semibold text-cyan-400">Sartaj Ashraf</span>, 
                        a passionate Full Stack Developer from the beautiful valleys of Kashmir. 
                        I specialize in building exceptional digital experiences using the MERN stack, 
                        combining creativity with technical expertise to bring ideas to life.
                      </p>
                      <p>
                        Currently working at <span className="font-semibold text-blue-400">Oasis Ascend</span> in Srinagar, 
                        I focus on creating scalable web applications that not only look stunning but also 
                        deliver outstanding performance and user experience.
                      </p>
                      <p>
                        When I'm not coding, you'll find me exploring the latest web technologies, 
                        contributing to open-source projects, or enjoying the breathtaking landscapes 
                        that Kashmir has to offer. I believe in continuous learning and staying ahead 
                        of the technological curve.
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack Progress */}
                  <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                      <Code className="text-purple-400" size={24} />
                      Technical Proficiency
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {techStack.map((tech, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-white">{tech.name}</span>
                            <span className="text-sm text-gray-400">{tech.level}%</span>
                          </div>
                          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${tech.color} rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: isVisible ? `${tech.level}%` : '0%' }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="space-y-6 animate-fadeIn">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="group relative"
                      onMouseEnter={() => setHoveredSkill(index)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${skill.gradient} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gray-800/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              {skill.icon}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-white mb-3">{skill.name}</h3>
                            <p className="text-gray-400 mb-4 leading-relaxed">{skill.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {skill.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <div className="space-y-8 animate-fadeIn">
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                            <div className="flex items-center gap-4 text-gray-400">
                              <span className="font-medium text-cyan-400">{exp.company}</span>
                              <span>•</span>
                              <span>{exp.location}</span>
                              <span>•</span>
                              <span className="px-2 py-1 bg-gray-800/50 rounded text-xs">{exp.type}</span>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400">
                              {exp.period}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-6 leading-relaxed">{exp.description}</p>

                        {/* Achievements */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-white mb-3">Key Achievements:</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {exp.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex items-center gap-2 text-gray-400">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                                <span className="text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-gray-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Tab */}
              {activeTab === "education" && (
                <div className="space-y-8 animate-fadeIn">
                  {education.map((edu, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                            <div className="flex items-center gap-4 text-gray-400">
                              <span className="font-medium text-emerald-400">{edu.institution}</span>
                              <span>•</span>
                              <span>{edu.location}</span>
                              <span>•</span>
                              <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-xs text-emerald-400">
                                {edu.grade}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg text-sm text-emerald-400">
                              {edu.period}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-6 leading-relaxed">{edu.description}</p>

                        {/* Key Subjects */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3">Key Subjects:</h4>
                          <div className="flex flex-wrap gap-2">
                            {edu.subjects.map((subject, subIndex) => (
                              <span
                                key={subIndex}
                                className="px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-gray-300"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Let's Build Something Amazing Together!</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Ready to turn your ideas into reality? Let's collaborate and create 
                exceptional digital experiences that make a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                  Get In Touch
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300">
                  View My Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default About;
