import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addMovieCollections,
  addMovieReleases,
  deleteMovieCollection,
  deleteMovieRelease,
  editMovieCollection,
  editMovieRelease,
  getMovieCollections,
  getMovieReleases,
} from "../../helper/apis";
import { useSelector } from "react-redux";

const CollectionsReleasesData = () => {
  const { lang } = useSelector((state) => state.teatimetelugu_admin);
  const [allReleases, setAllReleases] = useState([]);
  const [allCollections, setAllCollections] = useState([]);

  const [releaseCategory, setReleaseCategory] = useState("movie");
  const [collectionsCategory, setCollectionsCategory] =
    useState("1st-day-ap&ts");

  // State for adding new items - now with language support
  const [newRelease, setNewRelease] = useState({
    movie: { en: "", te: "" },
    date: { en: "", te: "" },
    category: { en: "", te: "" },
  });

  const [newCollection, setNewCollection] = useState({
    movie: { en: "", te: "" },
    amount: { en: "", te: "" },
    category: { en: "", te: "" },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaving2, setIsSaving2] = useState(false);

  // State for updating existing items - now with language support
  const [updateRelease, setUpdateRelease] = useState({
    id: "",
    movie: { en: "", te: "" },
    date: { en: "", te: "" },
    category: { en: "", te: "" },
  });

  const [updateCollection, setUpdateCollection] = useState({
    id: "",
    movie: { en: "", te: "" },
    amount: { en: "", te: "" },
    category: { en: "", te: "" },
  });

  const getReleases = async () => {
    try {
      const res = await getMovieReleases();
      if (res?.status === "success") {
        setAllReleases(res?.movieReleases);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCollections = async () => {
    try {
      const res = await getMovieCollections();
      if (res?.status === "success") {
        setAllCollections(res?.movieCollections);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit1 = async () => {
    setIsSaving(true);
    try {
      const res = await addMovieReleases(newRelease);
      if (res?.status === "success") {
        toast.success(res?.message);
        getReleases();
        setNewRelease({
          movie: { en: "", te: "" },
          date: { en: "", te: "" },
          category: { en: "", te: "" },
        });
      } else {
        toast.error(res?.message);
      }
      setIsSaving(false);
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };

  const onSubmit2 = async () => {
    setIsSaving2(true);
    try {
      const res = await addMovieCollections(newCollection);
      if (res?.status === "success") {
        toast.success(res?.message);
        setNewCollection({
          movie: { en: "", te: "" },
          amount: { en: "", te: "" },
          category: { en: "", te: "" },
        });
        getCollections();
      } else {
        toast.error(res?.message);
      }
      setIsSaving2(false);
    } catch (error) {
      console.log(error);
      setIsSaving2(false);
    }
  };

  const addUpdateRelease = (item) => {
    setUpdateRelease({
      id: item?._id || "",
      movie: item?.movie || { en: "", te: "" },
      date: item?.date || { en: "", te: "" },
      category: item?.category || { en: "", te: "" },
    });
  };

  const handleURChange = (e, lang, field) => {
    const { value } = e.target;
    setUpdateRelease((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        [lang]: value,
      },
    }));
  };

  const handleNewReleaseChange = (e, lang, field) => {
    const { value } = e.target;
    setNewRelease((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        [lang]: value,
      },
    }));
  };

  const cancelURChange = () => {
    setUpdateRelease({
      id: "",
      movie: { en: "", te: "" },
      date: { en: "", te: "" },
      category: { en: "", te: "" },
    });
  };

  const editRelease = async () => {
    try {
      const res = await editMovieRelease(updateRelease);
      if (res?.status === "success") {
        toast.success(res?.message);
        getReleases();
        cancelURChange();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRelease = async (id) => {
    try {
      const res = await deleteMovieRelease(id);
      if (res?.status === "success") {
        toast.success(res?.message);
        getReleases();
        cancelURChange();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addUpdateCollection = (item) => {
    setUpdateCollection({
      id: item?._id || "",
      movie: item?.movie || { en: "", te: "" },
      amount: item?.amount || { en: "", te: "" },
      category: item?.category || { en: "", te: "" },
    });
  };

  const handleUCChange = (e, lang, field) => {
    const { value } = e.target;
    setUpdateCollection((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        [lang]: value,
      },
    }));
  };

  const handleNewCollectionChange = (e, lang, field) => {
    const { value } = e.target;
    setNewCollection((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        [lang]: value,
      },
    }));
  };

  const cancelUCChange = () => {
    setUpdateCollection({
      id: "",
      movie: { en: "", te: "" },
      amount: { en: "", te: "" },
      category: { en: "", te: "" },
    });
  };

  const editCollection = async () => {
    try {
      const res = await editMovieCollection(updateCollection);
      if (res?.status === "success") {
        toast.success(res?.message);
        getCollections();
        cancelUCChange();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCollection = async (id) => {
    try {
      const res = await deleteMovieCollection(id);
      if (res?.status === "success") {
        toast.success(res?.message);
        getCollections();
        cancelUCChange();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReleases();
    getCollections();
  }, []);

  return (
    <>
      {/* <div className="box-shadow das-m20 p10">
        <h1>Collections & Releases</h1>
      </div> */}
      <div className="das-m20 p10 das-d-flex main-duo-con">
        <div className="box-shadow duo-con-50 br5 das-mr20">
          <h2 className="das-py20 text-center">
            {lang === "en" ? "Movie Releases" : "చలనచిత్ర విడుదలలు"}
          </h2>
          {allReleases?.length > 0 ? (
            <div className="movie-schedules-section">
              <div className="current-schedules">
                <span
                  style={{
                    backgroundColor:
                      releaseCategory === "movie" ? "red" : undefined,
                    color: releaseCategory === "movie" ? "#fff" : undefined,
                  }}
                  onClick={() => setReleaseCategory("movie")}
                >
                  {lang === "en" ? "Movies" : "చలనచిత్రాలు"}
                </span>
                <span
                  style={{
                    backgroundColor:
                      releaseCategory === "ott" ? "red" : undefined,
                    color: releaseCategory === "ott" ? "#fff" : undefined,
                  }}
                  onClick={() => setReleaseCategory("ott")}
                >
                  {lang === "en" ? "OTT" : "ఓటిటి"}
                </span>
              </div>
              <div className="schedules-list">
                <div className="schedules-list-item">
                  <span style={{ color: "red", fontWeight: "500" }}>
                    {lang === "en" ? "Name" : "పేరు"}
                  </span>
                  <span style={{ color: "red", fontWeight: "500" }}>
                    {lang === "en" ? "Release Date" : "విడుదల తేదీ"}
                  </span>
                </div>
                {allReleases?.map((item, index) => (
                  <div
                    className="schedules-list-item sl-item"
                    key={index}
                    style={{
                      display: releaseCategory !== item?.category?.en && "none",
                    }}
                    onClick={() => addUpdateRelease(item)}
                  >
                    <span className="text-center">
                      {lang === "en" ? item?.movie?.en : item?.movie?.te}
                    </span>
                    <span>
                      {lang === "en" ? item?.date?.en : item?.date?.te}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center das-mb20">No data exist</p>
          )}
        </div>
        <div className="box-shadow duo-con-50 br5">
          <h2 className="das-py20 text-center">
            {lang === "en" ? "Movie Collections" : "చలనచిత్ర సేకరణలు"}
          </h2>
          {allCollections?.length > 0 ? (
            <div className="movie-schedules-section">
              <div className="current-schedules">
                <span
                  style={{
                    backgroundColor:
                      collectionsCategory === "1st-day-ap&ts"
                        ? "red"
                        : undefined,
                    color:
                      collectionsCategory === "1st-day-ap&ts"
                        ? "#fff"
                        : undefined,
                  }}
                  onClick={() => setCollectionsCategory("1st-day-ap&ts")}
                >
                  {lang === "en" ? "1st Day TS & AP" : "1వ రోజు TS & AP"}
                </span>
                <span
                  style={{
                    backgroundColor:
                      collectionsCategory === "1st-day-ww" ? "red" : undefined,
                    color:
                      collectionsCategory === "1st-day-ww" ? "#fff" : undefined,
                  }}
                  onClick={() => setCollectionsCategory("1st-day-ww")}
                >
                  {lang === "en" ? "1st Day WW" : "1వ రోజు WW"}
                </span>
                <span
                  style={{
                    backgroundColor:
                      collectionsCategory === "closing-ww" ? "red" : undefined,
                    color:
                      collectionsCategory === "closing-ww" ? "#fff" : undefined,
                  }}
                  onClick={() => setCollectionsCategory("closing-ww")}
                >
                  {lang === "en" ? "Closing WW" : "మూసివేత WW"}
                </span>
              </div>
              <div className="schedules-list">
                <div className="schedules-list-item">
                  <span style={{ color: "red", fontWeight: "500" }}>
                    {lang === "en" ? "Name" : "పేరు"}
                  </span>
                  <span style={{ color: "red", fontWeight: "500" }}>
                    {lang === "en" ? "Amount" : "మొత్తం"}
                  </span>
                </div>
                {allCollections?.map((item, index) => (
                  <div
                    className="schedules-list-item sl-item"
                    key={index}
                    style={{
                      display:
                        collectionsCategory !== item?.category?.en && "none",
                    }}
                    onClick={() => addUpdateCollection(item)}
                  >
                    <span className="text-center">
                      {lang === "en" ? item?.movie?.en : item?.movie?.te}
                    </span>
                    <span>
                      {lang === "en" ? item?.amount?.en : item?.amount?.te}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center das-mb20">
              {lang === "en" ? "No data exist" : "డేటా లేదు"}
            </p>
          )}
        </div>
      </div>

      <div className="das-m20 p10 das-d-flex main-duo-con">
        {updateRelease?.id === "" ? (
          <div className="box-shadow duo-con-50 das-mr20 br5">
            <h2 className="das-py20 text-center">
              {lang === "en"
                ? "Add Movie Release"
                : "చలనచిత్ర విడుదలను జోడించండి"}
            </h2>
            <div className="das-mx20">
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Add Movie/Series Name</h3>
                <input
                  type="text"
                  placeholder="Name in English..."
                  className="br5"
                  value={newRelease.movie.en}
                  onChange={(e) => handleNewReleaseChange(e, "en", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">చలనచిత్ర/సిరీస్ పేరు జోడించండి</h3>
                <input
                  type="text"
                  placeholder="Name in Telugu..."
                  className="br5"
                  value={newRelease.movie.te}
                  onChange={(e) => handleNewReleaseChange(e, "te", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Add Release Date</h3>
                <input
                  type="text"
                  className="br5"
                  placeholder="Ex. 08 Nov 2024"
                  value={newRelease.date.en}
                  onChange={(e) => handleNewReleaseChange(e, "en", "date")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">విడుదల తేదీ జోడించండి</h3>
                <input
                  type="text"
                  className="br5"
                  placeholder="Ex. 08 నవంబర్ 2024"
                  value={newRelease.date.te}
                  onChange={(e) => handleNewReleaseChange(e, "te", "date")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Category</h3>
                <select
                  className="br5"
                  value={newRelease.category.en}
                  onChange={(e) => handleNewReleaseChange(e, "en", "category")}
                >
                  <option value="">Select Here</option>
                  <option value="movie">Movie</option>
                  <option value="ott">OTT</option>
                </select>
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">కేటగిరీ</h3>
                <select
                  className="br5"
                  value={newRelease.category.te}
                  onChange={(e) => handleNewReleaseChange(e, "te", "category")}
                >
                  <option value="">ఇక్కడ ఎంచుకోండి</option>
                  <option value="సినిమా">సినిమా</option>
                  <option value="ఓటీటీ">ఓటీటీ</option>
                </select>
              </div>

              <div className="other-details das-mb20">
                <div></div>
                {!isSaving ? (
                  <div className="post-news-btn btn" onClick={onSubmit1}>
                    Post
                  </div>
                ) : (
                  <button type="submit" className="is-submitting-btn btn">
                    Submitting...
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="box-shadow duo-con-50 das-mr20 br5">
            <h2 className="das-py20 text-center">Update Movie Release</h2>
            <div className="das-mx20">
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Movie/Series Name</h3>
                <input
                  type="text"
                  placeholder="Name in English..."
                  className="br5"
                  value={updateRelease.movie.en}
                  onChange={(e) => handleURChange(e, "en", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">చలనచిత్ర/సిరీస్ పేరు జోడించండి</h3>
                <input
                  type="text"
                  placeholder="Name in Telugu..."
                  className="br5"
                  value={updateRelease.movie.te}
                  onChange={(e) => handleURChange(e, "te", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Release Date</h3>
                <input
                  type="text"
                  className="br5"
                  placeholder="Ex. 08 Nov 2024"
                  value={updateRelease.date.en}
                  onChange={(e) => handleURChange(e, "en", "date")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">విడుదల తేదీ</h3>
                <input
                  type="text"
                  className="br5"
                  placeholder="Ex. 08 నవంబర్ 2024"
                  value={updateRelease.date.te}
                  onChange={(e) => handleURChange(e, "te", "date")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Category</h3>
                <select
                  className="br5"
                  value={updateRelease.category.en}
                  onChange={(e) => handleURChange(e, "en", "category")}
                >
                  <option value="">Select Here</option>
                  <option value="movie">Movie</option>
                  <option value="ott">OTT</option>
                </select>
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">కేటగిరీ</h3>
                <select
                  className="br5"
                  value={updateRelease.category.te}
                  onChange={(e) => handleURChange(e, "te", "category")}
                >
                  <option value="">ఇక్కడ ఎంచుకోండి</option>
                  <option value="సినిమా">సినిమా</option>
                  <option value="ఓటీటీ">ఓటీటీ</option>
                </select>
              </div>

              <div className="other-details das-mb20">
                <div className="btn">
                  <span className="das-mr20" onClick={cancelURChange}>
                    Cancel
                  </span>
                  <span className="color-red">
                    <i
                      className="fa fa-trash"
                      onClick={() => deleteRelease(updateRelease?.id)}
                    ></i>
                  </span>
                </div>
                {!isSaving ? (
                  <div className="post-news-btn btn" onClick={editRelease}>
                    Update
                  </div>
                ) : (
                  <button type="submit" className="is-submitting-btn btn">
                    Submitting...
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {updateCollection?.id === "" ? (
          <div className="box-shadow duo-con-50 br5">
            <h2 className="das-py20 text-center">
              {lang === "en"
                ? "Add Movie Collection"
                : "సినిమా కలెక్షన్ జోడించండి"}
            </h2>
            <div className="das-mx20">
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Add Movie/Series Name</h3>
                <input
                  type="text"
                  placeholder="Name in English..."
                  className="br5"
                  value={newCollection.movie.en}
                  onChange={(e) => handleNewCollectionChange(e, "en", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">చలనచిత్ర/సిరీస్ పేరు జోడించండి</h3>
                <input
                  type="text"
                  placeholder="Name in Telugu..."
                  className="br5"
                  value={newCollection.movie.te}
                  onChange={(e) => handleNewCollectionChange(e, "te", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Add Amount</h3>
                <input
                  type="text"
                  placeholder="Ex. 100 Crores"
                  className="br5"
                  value={newCollection.amount.en}
                  onChange={(e) => handleNewCollectionChange(e, "en", "amount")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">సేకరణలు</h3>
                <input
                  type="text"
                  placeholder="Ex. 100 కోట్లు"
                  className="br5"
                  value={newCollection.amount.te}
                  onChange={(e) => handleNewCollectionChange(e, "te", "amount")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Category</h3>
                <select
                  className="br5"
                  value={newCollection.category.en}
                  onChange={(e) =>
                    handleNewCollectionChange(e, "en", "category")
                  }
                >
                  <option value="">Select Here</option>
                  <option value="1st-day-ap&ts">1st Day TS & AP</option>
                  <option value="1st-day-ww">1st Day WW</option>
                  <option value="closing-ww">Closing WW</option>
                </select>
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">కేటగిరీ</h3>
                <select
                  className="br5"
                  value={newCollection.category.te}
                  onChange={(e) =>
                    handleNewCollectionChange(e, "te", "category")
                  }
                >
                  <option value="">ఇక్కడ ఎంచుకోండి</option>
                  <option value="మొదటి రోజు TS & AP">మొదటి రోజు TS & AP</option>
                  <option value="మొదటి రోజు WW">మొదటి రోజు WW</option>
                  <option value="క్లోజింగ్ WW">క్లోజింగ్ WW</option>
                </select>
              </div>

              <div className="other-details das-mb20">
                <div></div>
                {!isSaving2 ? (
                  <div className="post-news-btn btn" onClick={onSubmit2}>
                    Post
                  </div>
                ) : (
                  <button type="submit" className="is-submitting-btn btn">
                    Submitting...
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="box-shadow duo-con-50 br5">
            <h2 className="das-py20 text-center">
              {lang === "en"
                ? "Update Movie Collection"
                : "సినిమా కలెక్షన్‌ను అప్‌డేట్ చేయండి"}
            </h2>
            <div className="das-mx20">
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Movie/Series Name</h3>
                <input
                  type="text"
                  placeholder="Name in English..."
                  className="br5"
                  value={updateCollection.movie.en}
                  onChange={(e) => handleUCChange(e, "en", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">చలనచిత్ర/సిరీస్ పేరు జోడించండి</h3>
                <input
                  type="text"
                  placeholder="Name in Telugu..."
                  className="br5"
                  value={updateCollection.movie.te}
                  onChange={(e) => handleUCChange(e, "te", "movie")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Amount</h3>
                <input
                  type="text"
                  placeholder="Ex. 100 Crores"
                  className="br5"
                  value={updateCollection.amount.en}
                  onChange={(e) => handleUCChange(e, "en", "amount")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">సేకరణలు</h3>
                <input
                  type="text"
                  placeholder="Ex. 100 కోట్లు"
                  className="br5"
                  value={updateCollection.amount.te}
                  onChange={(e) => handleUCChange(e, "te", "amount")}
                />
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">Category</h3>
                <select
                  className="br5"
                  value={updateCollection.category.en}
                  onChange={(e) => handleUCChange(e, "en", "category")}
                >
                  <option value="">Select Here</option>
                  <option value="1st-day-ap&ts">1st Day TS & AP</option>
                  <option value="1st-day-ww">1st Day WW</option>
                  <option value="closing-ww">Closing WW</option>
                </select>
              </div>
              <div className="wns-box das-my20 das-py20">
                <h3 className="text-start">కేటగిరీ</h3>
                <select
                  className="br5"
                  value={updateCollection.category.te}
                  onChange={(e) => handleUCChange(e, "te", "category")}
                >
                  <option value="">ఇక్కడ ఎంచుకోండి</option>
                  <option value="మొదటి రోజు TS & AP">మొదటి రోజు TS & AP</option>
                  <option value="మొదటి రోజు WW">మొదటి రోజు WW</option>
                  <option value="క్లోజింగ్ WW">క్లోజింగ్ WW</option>
                </select>
              </div>

              <div className="other-details das-mb20">
                <div className="btn">
                  <span className="das-mr20" onClick={cancelUCChange}>
                    Cancel
                  </span>
                  <span className="color-red">
                    <i
                      className="fa fa-trash"
                      onClick={() => deleteCollection(updateCollection?.id)}
                    ></i>
                  </span>
                </div>
                {!isSaving2 ? (
                  <div className="post-news-btn btn" onClick={editCollection}>
                    Update
                  </div>
                ) : (
                  <button type="submit" className="is-submitting-btn btn">
                    Submitting...
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CollectionsReleasesData;
