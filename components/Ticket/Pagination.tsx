import React from 'react';
import { useRouter } from 'next/router';
interface PaginationProps {
    totalPages: number;
    currentPage: number;
  }
const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage }) => {
  const router = useRouter();

  const handlePageChange = (page:number) => {
    let pathname = router.pathname;
    if(!pathname.includes('tickets')){
      pathname+='tickets';
    }
    let path=pathname+'/page/'+ page;
    if(pathname.includes('[page]')){
        path=pathname.replace('[page]',page.toString());
    }
    if (page !== currentPage) {
      router.push({
        pathname: path ,
      });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    if(totalPages<2)
      return <></>;
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
    <div className="pagination my-4 flex items-center gap-2 w-full flex justify-center flex-wrap text-xs">
      {renderPageNumbers()}
    </div>
  );
};

export default Pagination;