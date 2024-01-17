import React, { useEffect, useState } from "react";
import styled from "styled-components";

const TodayListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 700px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
`;

const TodayListContent = styled.div`
  width: 50%;
  padding: 20px;
  background-color: #ffffff;
  border: 3px solid #3498db;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    color: #000000;
    margin-bottom: 20px;
  }

  img {
    width: 150px;
    height: 150px;
    margin: 20px 0;
  }

  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  a {
    text-decoration: none;
    color: #3498db;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface Book {
  title: string;
  author: string;
  thumbnail: string;
  previewLink: string;
  buyLink: string;
}

const TodayList = () => {
  const [recommendedBook, setRecommendedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchRecommendedBook = async () => {
      const randomKeyword = generateRandomKeyword();

      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=random+${randomKeyword}`);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);
        const randomBook = getRandomBook(data.items);
        setRecommendedBook(randomBook);
      } catch (err) {
        console.error("Error fetching data :", err);
      }
    };

    fetchRecommendedBook();
  }, []);

  const generateRandomKeyword = (): string => {
    const developerKeywords = ["programming", "software development", "coding", "web development", "javascript", "react", "Java", "C++"];
    const randomIndex = Math.floor(Math.random() * developerKeywords.length);
    return developerKeywords[randomIndex];
  };

  const getRandomBook = (books: any[]): Book => {
    const randomIndex = Math.floor(Math.random() * books.length);
    const book = books[randomIndex].volumeInfo;

    return {
      title: book.title,
      author: book.authors ? book.authors.join(", ") : "Unknown Author",
      thumbnail: book.imageLinks ? book.imageLinks.thumbnail : "",
      previewLink: book.previewLink || "",
      buyLink: book.saleInfo?.buyLink || "",
    };
  };

  return (
    <TodayListContent>
      <h2>개발자 도서 추천</h2>
      {recommendedBook && (
        <div>
          <h3>{recommendedBook.title}</h3>
          <p>작가: {recommendedBook.author}</p>
          <img src={recommendedBook.thumbnail} alt="Book Thumbnail"></img>
          {recommendedBook.previewLink && (
            <p>
              <a href={recommendedBook.previewLink} target="_blank" rel="noopener noreferrer">
                미리보기
              </a>
            </p>
          )}
          {recommendedBook.buyLink && (
            <p>
              <a href={recommendedBook.buyLink} target="_blank" rel="noopener noreferrer">
                구매하기
              </a>
            </p>
          )}
        </div>
      )}
    </TodayListContent>
  );
};

export default TodayList;
