import React, { useState, useEffect } from "react";
import "./App.css";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import { sortData, prettyPrintStat, capitalizeFirstLetter } from "./utills/util";
import numeral from "numeral";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
import Footer from "./components/Footer";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);

  //table
  const [tableData, setTableData] = useState([]);

  //map
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 7.8, lng: 80 });
  const [mapZoom, setMapZoom] = useState(4);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //1st view- worldwide
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  //on country option change
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter({ lat: 7.8, lng: 80 })
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__container">
        <div className="app__left">
          <div className="app__header">
            <div className="app__header_hedaing">
              <h1>
                <span className="app__header__heading__red">COVID-19</span>Live Tracker
              </h1>
              <span>by Nathindu Himansha</span>
            </div>

            <FormControl className="app__dropdown">
              <Select
                className="app__dropdown__select"
                variant="outlined"
                value={country}
                onChange={onCountryChange}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title="New Cases"
              isRed
              active={casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0,0")}
            />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              title="Recently Recovered"
              active={casesType === "recovered"}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0,0")}
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="New Deaths"
              isOrange
              active={casesType === "deaths"}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0,0")}
            />
          </div>
          <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
        </div>
        <Card className="app__right">
          <CardContent>
            <div className="app__information">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
              <br />
              <br />

              <h3>Worldwide New {capitalizeFirstLetter(casesType)}</h3>
              <br />
              <LineGraph
                className={"app__graph"}
                color={
                  (casesType === "deaths" && "#CC1034") ||
                  (casesType === "recovered" && "#7dd71d") ||
                  (casesType === "cases" && "#CC1034")
                }
                casesType={casesType}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="app_footer">
        <Footer />
      </div>
    </div>
  );
};

export default App;
