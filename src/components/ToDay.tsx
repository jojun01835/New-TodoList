import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

// 읽어온 날씨정보 타입정리
interface WeatherData {
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}
// 읽어온 날씨정보 타입정리

// 디테일 날씨정보 타입
interface DetailedWeatherData {
  list: {
    main: {
      humidity: number;
      feels_like: number;
    };
    wind: {
      speed: number;
    };
  }[];
}
// 디테일 날씨정보 타입

// 스타일
const TodayW = styled.div`
  width: 38%;
  background-color: #ffffff;
  border: 3px solid #3498db;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  overflow: hidden;

  p {
    margin-top: 20px;
  }
`;

const StyledButton = styled.button`
  margin-top: 50px;
  background-color: #5ab4f0;
  color: #000000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: "SEBANG", sans-serif;

  &:hover {
    background-color: #297fb8;
  }
`;

// 스타일

const ToDay: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>();
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [detailedWeatherData, setDetailedWeatherData] = useState<DetailedWeatherData | null>();
  const key = "aec5078b1a25ccf6ef36d87a1ad624f5";
  const city = "seoul";

  // OpenWather Api axios로 get하기
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
        const currentWeatherData = res.data;
        console.log(currentWeatherData);

        const resDetailed = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`);
        const detailedWeatherData = resDetailed.data;
        console.log(detailedWeatherData);

        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        const currentDay = format(currentDate, "yyyy년 LL월 dd일 HH:mm:ss");

        setCurrentDate(currentDay);
        setWeatherData(currentWeatherData);
        setDetailedWeatherData(detailedWeatherData);
      } catch (err) {
        console.log("Error fetching Weather data", err);
      }
    };
    fetchWeatherData();
  }, [key, city]);

  // OpenWather Api axios로 get하기

  // 받아온 날씨 정보를 한국말로 바꾸기
  const weatherDescription: { [key: string]: string } = {
    "clear sky": "맑음",
    "few clouds": "조금 흐림",
    "scattered clouds": "흐림",
    "broken clouds": "구름이 많음",
    "shower rain": "소나기",
    "light snow": "약간 눈",
    rain: "비",
    thunderstorm: "천둥번개",
    snow: "눈",
    mist: "안개",
  };

  // 받아온 날씨 정보를 한국말로 바꾸기

  const recommendClothing = (temp: number) => {
    if (temp >= 25) {
      return "반팔, 얇은 셔츠, 반바지, 면바지";
    } else if (temp >= 20) {
      return "얇은 니트, 맨투맨, 가디건, 청바지";
    } else if (temp >= 15) {
      return "자켓, 가디건, 야상, 면바지";
    } else if (temp >= 10) {
      return "자켓, 코트, 야상, 니트";
    } else {
      return "패딩, 두꺼운 옷, 코트";
    }
  };

  const getWeatherAdvice = (description: string) => {
    switch (description) {
      case "clear sky":
        return "맑은 날입니다 햇살을 즐기세요.";
      case "rain":
        return "우산 잊지 마세요. 비가 와요!";
      case "snow":
        return "눈이 오네요. 미끄러운 곳은 조심하세요.";
      default:
        return "오늘의 날씨 상황을 확인해보세요!";
    }
  };

  const handleToggleDetailedView = () => {
    setIsDetailedView(!isDetailedView);
  };

  // 기존 아이콘 변경하기
  const getIcon = (icon: string) => {
    switch (icon) {
      case "01d":
      case "01n":
        return "☀";
      case "02d":
      case "02n":
        return "🌥";
      case "03d":
      case "03dn":
        return "☁";
      case "04d":
      case "04dn":
        return "🌥";
      case "09d":
      case "09dn":
        return "🌧";
      case "10d":
      case "10dn":
        return "🌧";
      case "11d":
      case "11dn":
        return "🌩";
      case "13d":
      case "13dn":
        return "❄";
      case "50d":
      case "50dn":
        return `🌫`;
    }
  };
  // 기존 아이콘 변경하기

  return (
    <TodayW>
      {weatherData ? (
        <div>
          <p> 오늘의 서울 날씨🌅</p>
          <p>
            날씨 정보 🌞&nbsp;
            {weatherData.weather[0]?.description in weatherDescription
              ? weatherDescription[weatherData.weather[0]?.description]
              : weatherData.weather[0]?.description}
          </p>
          <p>온도🔥 {weatherData.main.temp}°C</p>
          <p>{getWeatherAdvice(weatherData.weather[0].description)}</p>
          <p>{getIcon(weatherData.weather[0].icon)}</p>
          <p>오늘의 추천의상 {recommendClothing(weatherData.main.temp)}</p>
          <StyledButton onClick={handleToggleDetailedView}>{isDetailedView ? "간단히 보기" : "자세히 보기"}</StyledButton>
          <AnimatePresence>
            {isDetailedView && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p>상세 날씨 정보 💬</p>
                <p>현재시간🕓</p>
                <p>{currentDate}</p>
                <p>습도💧 {detailedWeatherData?.list[0]?.main.humidity}%</p>
                <p>풍속💨 {detailedWeatherData?.list[0]?.wind.speed}m/s</p>
                <p>체감온도🔥 {detailedWeatherData?.list[0].main.feels_like}°C</p>
                <p>일출⛅ {format(new Date(weatherData?.sys?.sunrise * 1000), "HH:mm:ss")}</p>
                <p>일몰🌙 {format(new Date(weatherData?.sys?.sunset * 1000), "HH:mm:ss")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <p>날씨 정보를 불러오는 중입니다...</p>
      )}
    </TodayW>
  );
};

export default ToDay;
