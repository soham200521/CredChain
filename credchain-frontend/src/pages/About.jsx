import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

// Example team data (add instagram field if available)
const team = [
  {
    name: "Sriram Varun Dittakavi",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/varun.jpg",
    linkedin: "https://www.linkedin.com/in/sri-ram-varun-dittakavi-4103a428a/",
    instagram: "https://instagram.com/varun_0636" // Add your actual Instagram link
  },
  {
    name: "Shubham Daya Vadher",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/shubham.jpeg",
    linkedin: "https://www.linkedin.com/in/shubham-vadher-5839782a7/",
    instagram: "https://instagram.com/shubhamv_78"
  },
  {
    name: "Deep Sai Yadamreddi",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/deepsai.jpeg",
    linkedin: "https://www.linkedin.com/in/deep-sai-yadamreddi-6207bb1a9/",
    instagram: "https://instagram.com/_deepsai_06"
  },
  {
    name: "Soham Bacchuwar",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/soham.jpg",
    linkedin: "https://www.linkedin.com/in/soham-bacchuwar-47a5b4296/",
    instagram: "https://instagram.com/sohambacchuwar"
  },
  // Add more team members as needed
];

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">About CredChain</h1>
      <p className="mb-10 text-lg text-gray-700 text-center">
        CredChain is a blockchain-powered platform that reimagines credit scoring for the modern age. 
        By leveraging alternative data like utility payments and gig economy income, we empower individuals 
        without traditional credit histories to access fair financial opportunities. Our team is passionate 
        about transparency, user empowerment, and building the future of decentralized finance.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-center">Meet the Team</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {team.map((member, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg p-6 w-64 flex flex-col items-center">
            <img
              src={member.img}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500"
            />
            <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-blue-600 text-center">{member.role}</p>
            <div className="flex space-x-4 mt-2">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900"
                title="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-700"
                  title="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
