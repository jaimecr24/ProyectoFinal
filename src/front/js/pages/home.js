import React, { useContext, useState, useEffect } from "react";

import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import Map from "../component/map.js";

export const Home = () => {
  const { actions, store } = useContext(Context);
  const [placesLenght, setPlacesLenght] = useState(null);
  const [singlePlace, setSinglePlace] = useState({});

  const getSinglePlace = (id) => {
    fetch(process.env.BACKEND_URL + "/api/places/" + id)
      .then((res) => res.json())
      .then((data) => {
        setSinglePlace(data);
      })
      .catch((error) => console.log("Error loading place from backend", error));
  };

  const countPlaces = () => {
    fetch(process.env.BACKEND_URL + "/api/places")
      .then((resp) => resp.json())
      .then((data) => setPlacesLenght(data.length))
      .catch((error) =>
        console.log("Error loading places from backend", error)
      );
  };

  const getRandom = (max) => {
    const rand = 1 + Math.floor(Math.random() * max);
    console.log(rand);
    return rand;
  };

  useEffect(() => {
    countPlaces();
    placesLenght ? getSinglePlace(getRandom(placesLenght)) : null;
  }, []);

  useEffect(() => {
    placesLenght ? getSinglePlace(getRandom(placesLenght)) : null;
  }, [placesLenght]);

  let history = useHistory();

  const style = {
    width: "200px",
  };
  const cardStyle = {
    width: "15rem",
  };

  let [sug, setSug] = useState([]);

  const handleChange = (e) => {
    let key = e.target.value;
    if (key.length == 1) {
      actions
        .getBrowsePlace(key)
        .then((res) => res.json())
        .then((data) => setSug(data.map((e) => e["name"])))
        .catch((error) => console.log("Error in getBrowsePlace", error));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let key = document.getElementById("mySearch").value;
    if (key.length > 0) {
      actions
        .getBrowsePlace(key)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            let path = "/place/" + data[0]["id"]; // Go to the first place. To do: present a list of results to user.
            history.push({ pathname: path }); // Equivalent in js to <Link ... >
          } else console.log("data is []");
        })
        .catch((error) => console.log("Error in getBrowsePlace", error));
    }
  };

  return (
    <div className="text-center mt-4">
      <h1
        className=""
        style={{
          fontFamily: "IM Fell Great Primer SC",
          fontSize: "55px",
          color: "#fa9f42",
        }}
      >
        MovTour
      </h1>
      <h4
        className="text-white"
        style={{ fontFamily: "IM Fell Great Primer SC" }}
      >
        “The world isnt in your books and maps, it is out there.” ― The Hobbit,
        J.R.R. Tolkien
      </h4>
      <form
        className="d-flex justify-content-center my-4"
        onSubmit={handleSearch}
      >
        <input
          id="mySearch"
          type="search"
          list="suggestions"
          className="form-control rounded fs-4"
          placeholder="Buscar un lugar"
          onChange={handleChange}
          style={{ width: "40rem" }}
        />
        <button
          type="submit"
          className="btn btn-dark"
          onSubmit={handleSearch}
          style={{ width: "10rem" }}
        >
          Buscar
        </button>
        <datalist id="suggestions">
          {sug
            ? sug.map((e, i) => <option key={i} data-value={i} value={e} />)
            : ""}
        </datalist>
      </form>
      {singlePlace ? (
        <div className="row mt-0">
          <div
            className="card design-card bg-dark w-75 mx-auto d-flex flex-row mt-0"
            style={{ borderColor: "#fa9f42" }}
          >
            <div className="card ms-1 me-5 border-0">
              <img
                src={singlePlace.urlPhoto}
                className="characters card-img-top mx-auto"
                alt={singlePlace.name}
                style={{ objectFit: "cover" }}
              />
              <div className="card-body bg-dark">
                <h5
                  className="card-title"
                  style={{
                    textAlign: "center",
                    paddingBottom: "25px",
                    color: "#fa9f42",
                  }}
                >
                  {singlePlace.name}
                </h5>

                <Link to={"/place/" + singlePlace.id}>
                  <span className="btn btn-outline">Aprender más</span>
                </Link>
                {store.activeUser.id ? (
                  <span
                    className="btn btn-outline-danger ms-1"
                    onClick={() => actions.addFavPlace(singlePlace.id)}
                  >
                    <i className="fas fa-heart" />
                  </span>
                ) : null}
              </div>
            </div>
            <div className="card">
              <Map
                lat={singlePlace.latitude}
                lng={singlePlace.longitude}
                width="600"
                height="350"
                name={singlePlace.name}
                direction={singlePlace.address}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
