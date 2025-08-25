import React, { useEffect, useState } from "react";
import Featured from "./Featured";
import { getDashData } from "../../helper/apis";
import BreakingNews from "./BreakingNews";
import Trends from "./Trends";
import TopNine from "./TopNine";
import HotTopics from "./HotTopics";
import CategoryTop from "./CategoryTop";

const HomeController = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashData();
        if (res?.status === "success") {
          setData(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="das-home">
      <div className="das-home-cards">
        <div className="das-home-card">
          <span className="das-home-card-num">{data?.newsCount || "0"}</span>
          <span className="das-home-card-title">Total News</span>
        </div>
        <div className="das-home-card">
          <span className="das-home-card-num">
            {data?.galleriesCount || "0"}
          </span>
          <span className="das-home-card-title">Total Galleries</span>
        </div>
        <div className="das-home-card">
          <span className="das-home-card-num">{data?.videosCount || "0"}</span>
          <span className="das-home-card-title">Total Videos</span>
        </div>
        <div className="das-home-card">
          <span className="das-home-card-num">{data?.usersCount || "0"}</span>
          <span className="das-home-card-title">Total Users</span>
        </div>
        {/* <div className="das-home-card">
          <span className="das-home-card-num">0</span>
          <span className="das-home-card-title">Active Users</span>
        </div> */}
        <div className="das-home-card">
          <span className="das-home-card-num">{data?.adminsCount || "0"}</span>
          <span className="das-home-card-title">Admins</span>
        </div>
        <div className="das-home-card">
          <span className="das-home-card-num">{data?.writersCount || "0"}</span>
          <span className="das-home-card-title">Writers</span>
        </div>
      </div>

      <BreakingNews />
      <Featured />
      <TopNine />
      <Trends />
      <HotTopics />
      <CategoryTop />
    </div>
  );
};

export default HomeController;
