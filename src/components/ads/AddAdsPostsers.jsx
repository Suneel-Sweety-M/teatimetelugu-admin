import { useEffect, useState } from "react";
import {
  getCategoryLongAd,
  getCategoryShortAd,
  getHomeLongAd,
  getHomeShortAd,
  getMoviePoster,
  getNavbarAd,
  getNewsLongAd,
  getNewsShortAd,
  getPopupPoster,
  setCategoryLongAd,
  setCategoryShortAd,
  setHomeLongAd,
  setHomeShortAd,
  setMoviePoster,
  setNavbarAd,
  setNewsLongAd,
  setNewsShortAd,
  setPopupPoster,
} from "../../helper/apis";
import { toast } from "react-toastify"; 

const AddAdsPosters = () => {
  const [popupPosterImg, setPopupPosterImg] = useState("");
  const [popupPosterLink, setPopupPosterLink] = useState("");
  const [moviePosterImg, setMoviePosterImg] = useState("");
  const [moviePosterLink, setMoviePosterLink] = useState("");
  const [navbarAdImg, setNavbarAdImg] = useState("");
  const [navbarAdLink, setNavbarAdLink] = useState("");
  // State hooks
  const [homeLongAdImg, setHomeLongAdImg] = useState("");
  const [homeLongAdLink, setHomeLongAdLink] = useState("");
  const [homeShortAdImg, setHomeShortAdImg] = useState("");
  const [homeShortAdLink, setHomeShortAdLink] = useState("");
  const [categoryLongAdImg, setCategoryLongAdImg] = useState("");
  const [categoryLongAdLink, setCategoryLongAdLink] = useState("");
  const [categoryShortAdImg, setCategoryShortAdImg] = useState("");
  const [categoryShortAdLink, setCategoryShortAdLink] = useState("");
  const [newsLongAdImg, setNewsLongAdImg] = useState("");
  const [newsLongAdLink, setNewsLongAdLink] = useState("");
  const [newsShortAdImg, setNewsShortAdImg] = useState("");
  const [newsShortAdLink, setNewsShortAdLink] = useState("");

  const handleGetMoviePoster = async () => {
    const res = await getMoviePoster();
    if (res?.status === "success") {
      setMoviePosterImg(res?.moviePoster?.img);
      setMoviePosterLink(res?.moviePoster?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleGetPopupPoster = async () => {
    const res = await getPopupPoster();
    if (res?.status === "success") {
      setPopupPosterImg(res?.popupPoster?.img);
      setPopupPosterLink(res?.popupPoster?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleGetNavbarAd = async () => {
    const res = await getNavbarAd();
    if (res?.status === "success") {
      setNavbarAdImg(res?.navbarAd?.img);
      setNavbarAdLink(res?.navbarAd?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleMoviePoster = async () => {
    const res = await setMoviePoster({
      img: moviePosterImg,
      link: moviePosterLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handlePopupPoster = async () => {
    const res = await setPopupPoster({
      img: popupPosterImg,
      link: popupPosterLink,
    });

    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handleNavbarAd = async () => {
    const res = await setNavbarAd({
      img: navbarAdImg,
      link: navbarAdLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handleGetHomeLongAd = async () => {
    const res = await getHomeLongAd();

    if (res?.status === "success") {
      setHomeLongAdImg(res?.homeLongAd?.img);
      setHomeLongAdLink(res?.homeLongAd?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleSetHomeLongAd = async () => {
    const res = await setHomeLongAd({
      img: homeLongAdImg,
      link: homeLongAdLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handleGetHomeShortAd = async () => {
    const res = await getHomeShortAd();

    if (res?.status === "success") {
      setHomeShortAdImg(res?.homeShortAd?.img);
      setHomeShortAdLink(res?.homeShortAd?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleSetHomeShortAd = async () => {
    const res = await setHomeShortAd({
      img: homeShortAdImg,
      link: homeShortAdLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handleGetCategoryLongAd = async () => {
    const res = await getCategoryLongAd();

    if (res?.status === "success") {
      setCategoryLongAdImg(res?.categoryLongAd?.img);
      setCategoryLongAdLink(res?.categoryLongAd?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleSetCategoryLongAd = async () => {
    const res = await setCategoryLongAd({
      img: categoryLongAdImg,
      link: categoryLongAdLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handleGetCategoryShortAd = async () => {
    const res = await getCategoryShortAd();

    if (res?.status === "success") {
      setCategoryShortAdImg(res?.categoryShortAd?.img);
      setCategoryShortAdLink(res?.categoryShortAd?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleSetCategoryShortAd = async () => {
    const res = await setCategoryShortAd({
      img: categoryShortAdImg,
      link: categoryShortAdLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handleGetNewsLongAd = async () => {
    const res = await getNewsLongAd();

    if (res?.status === "success") {
      setNewsLongAdImg(res?.newsLongAd?.img);
      setNewsLongAdLink(res?.newsLongAd?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleSetNewsLongAd = async () => {
    const res = await setNewsLongAd({
      img: newsLongAdImg,
      link: newsLongAdLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
    } else {
      toast.success(res?.message);
    }
  };

  const handleGetNewsShortAd = async () => {
    const res = await getNewsShortAd();

    if (res?.status === "success") {
      setNewsShortAdImg(res?.newsShortAd?.img);
      setNewsShortAdLink(res?.newsShortAd?.link);
    } else {
      toast.error(res?.message);
    }
  };

  const handleSetNewsShortAd = async () => {
    const res = await setNewsShortAd({
      img: newsShortAdImg,
      link: newsShortAdLink,
    });
    if (res?.status === "success") {
      toast.success(res?.message);
      setNewsShortAdImg(res?.newsShortAd?.img);
      setNewsShortAdLink(res?.newsShortAd?.link);
    } else {
      toast.success(res?.message);
    }
  };

  useEffect(() => {
    handleGetPopupPoster();
    handleGetMoviePoster();
    handleGetNavbarAd();
    handleGetHomeLongAd();
    handleGetHomeShortAd();
    handleGetCategoryLongAd();
    handleGetCategoryShortAd();
    handleGetNewsLongAd();
    handleGetNewsShortAd();
  }, []);

  return (
    <>
      <div className="das-mt20">
        <div className="das-news-container">
          <div className="das-news-container-title">Posters</div>
          <div className="das-posters-container">
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Popup Poster</b> (1000px X
                  600px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={popupPosterImg}
                      onChange={(e) => setPopupPosterImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={popupPosterLink}
                      onChange={(e) => setPopupPosterLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handlePopupPoster()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Movie Poster</b> (365px X 457px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={moviePosterImg}
                      onChange={(e) => setMoviePosterImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={moviePosterLink}
                      onChange={(e) => setMoviePosterLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleMoviePoster()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="das-news-container">
          <div className="das-news-container-title">Ads</div>
          <div className="das-posters-container">
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Navbar</b> Ad (748px X 78px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={navbarAdImg}
                      onChange={(e) => setNavbarAdImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={navbarAdLink}
                      onChange={(e) => setNavbarAdLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleNavbarAd()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Home</b> Long Ad (1200px X
                  190px)
                </p>
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3>Image Src</h3>
                    <input
                      className="br5"
                      value={homeLongAdImg}
                      onChange={(e) => setHomeLongAdImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3>Link</h3>
                    <input
                      className="br5"
                      value={homeLongAdLink}
                      onChange={(e) => setHomeLongAdLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleSetHomeLongAd()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Home</b> Short Ad (336px X
                  280px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={homeShortAdImg}
                      onChange={(e) => setHomeShortAdImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={homeShortAdLink}
                      onChange={(e) => setHomeShortAdLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleSetHomeShortAd()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Category</b> Long Ad (1200px X
                  100px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={categoryLongAdImg}
                      onChange={(e) => setCategoryLongAdImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={categoryLongAdLink}
                      onChange={(e) => setCategoryLongAdLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleSetCategoryLongAd()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Category</b> Short Ad (1200px X
                  190px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={categoryShortAdImg}
                      onChange={(e) => setCategoryShortAdImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={categoryShortAdLink}
                      onChange={(e) => setCategoryShortAdLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleSetCategoryShortAd()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Single News</b> Long Ad (336px X
                  280px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={newsLongAdImg}
                      onChange={(e) => setNewsLongAdImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={newsLongAdLink}
                      onChange={(e) => setNewsLongAdLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleSetNewsLongAd()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="das-poster-section">
              <div className="das-poster-section-top py10">
                <p>
                  <b className="color-main-org">Single News</b> Short Ad (348px
                  X 348px)
                </p>
                {/* <img src="/assets/Ad-top.png" alt="" /> */}
              </div>
              <div className="das-poster-section-bottom">
                <div className="other-details">
                  <div className="wns-box py10">
                    <h3 className="">Image Src</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={newsShortAdImg}
                      onChange={(e) => setNewsShortAdImg(e.target.value)}
                    />
                  </div>
                  <div className="wns-box py10">
                    <h3 className="">Link</h3>
                    <input
                      name=""
                      id=""
                      className="br5"
                      value={newsShortAdLink}
                      onChange={(e) => setNewsShortAdLink(e.target.value)}
                    />
                  </div>
                  <div className="das-mt20">
                    <button
                      className="btn save-btn"
                      onClick={() => handleSetNewsShortAd()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdsPosters;
