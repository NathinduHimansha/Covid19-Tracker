import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

//common library to select options according to the case type
const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 100,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 100,
  },
  deaths: {
    hex: "#FFA500",
    multiplier: 100,
  },
};

//sort table - same as java comparator
export const sortData = (data) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

//number formatter
export const prettyPrintStat = (stat) => (stat ? `+${numeral(stat).format("0.0a")}` : "+0");

//map data viewing optins
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
    >
      <Popup>
        <div className="info-container">
          <div className="info-flag">
            <img src={country.countryInfo.flag} alt="" />
          </div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">Total Cases: {numeral(country.cases).format("0,0")}</div>
          <div className="info-recovered">
            Total Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">Total Deaths: {numeral(country.deaths).format("0,0")}</div>
        </div>
      </Popup>
    </Circle>
  ));

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
