import React from "react";
import HistoryPage from "./HistoryPage";
import { FaHistory, FaGlobe, FaBuilding, FaUsers } from "react-icons/fa";

const ZenxHistory = () => {
  const sections = [
    {
      icon: <FaHistory />,
      title: "Our Journey",
      content: `Founded in 1876, Zenx pioneered innerwear, evolving and innovating not only the product, but also the way it has been marketed globally. Zenx manufactures, distributes, and markets comfort apparel for Men, Women, and Kids in more than 140 countries.`
    },
    {
      icon: <FaGlobe />,
      title: "Zenx in India",
      content: `Zenx Industries Ltd. was set up in 1994 to bring the world-renowned Zenx brand to India. The company manufactures, distributes, and markets products for Men, Women, and Kids, providing comfort and quality in every product.`
    },
    {
      icon: <FaBuilding />,
      title: "Page Industries Limited",
      content: `Zenx Industries Limited, located in Kanpur, India, is the exclusive licensee of Zenx International Inc for manufacture, distribution, and marketing of the Zenx brand in India, Sri Lanka, Oman, Bangladesh, Nepal, and UAE. Zenx Industries Ltd. became public limited in March 2007 and is listed on the BSE and NSE of India.`
    },
    {
      icon: <FaUsers />,
      title: "Our Promoters",
      content: `The promoters of Zenx in India are the Genomal family, who have been associated with Zenx International Inc. for over 25 years as their sole licensee in the Philippines. Their commitment to quality and innovation continues to drive Zenx’s growth in India and abroad.`
    }
  ];

  return <HistoryPage mainTitle="Zenx History - Evolution of Comfort Apparel in India" sections={sections} />;
};

export default ZenxHistory;
