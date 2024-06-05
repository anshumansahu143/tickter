import React from 'react';
import { useRouter } from 'next/router';
interface PaginationProps {
    totalPages: number;
    currentPage: number;
  }
const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage }) => {
  const router = useRouter();

  const handlePageChange = (page:number) => {
    console.log(router.pathname,page,currentPage);
    let path=router.pathname+'/page/'+ page;
    if(router.pathname.includes('[page]')){
        path=router.pathname.replace('[page]',page.toString());
    }
    if (page !== currentPage) {
      router.push({
        pathname: path ,
      });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button 
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? 'active btn' : 'btn'}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="pagination my-4 flex items-center gap-2">
      {renderPageNumbers()}
    </div>
  );
};

export default Pagination;