import React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #297fb8;
  }
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const PageButtons = [];

  for (let i = 1; i <= totalPages; i++) {
    PageButtons.push(
      <PageButton key={i} onClick={() => onPageChange(i)} style={{ backgroundColor: i === currentPage ? "#297fb8" : "#3498db" }}>
        {i}
      </PageButton>
    );
  }
  return <PaginationContainer>{PageButtons}</PaginationContainer>;
};

export default Pagination;
