import { SearchIcon } from '@/assets/icons';
import { InputHTMLAttributes, ReactNode, RefObject } from 'react';

interface TSearchInput extends InputHTMLAttributes<HTMLInputElement> {
  sz?: string;
  placeholder?: string;
  icon?: ReactNode;
  errorMess?: string;
  className?: string;
  ref?: RefObject<HTMLInputElement>;
}

export default function SearchInput({
  sz = 'lg',
  placeholder,
  ref,
  icon,
  errorMess,
  className,
  ...otherProps
}: TSearchInput) {
  return (
    <div className="w-full ">
      <div
        className={`flex  w-full   items-center space-x-4  rounded-lg px-4
        ${sz == 'lg' ? 'py-1.5' : 'py-[0.1rem]'} ${className} `}
      >
        {icon ? icon : <SearchIcon />}
        <input
          ref={ref}
          {...otherProps}
          type="text"
          className="border-none block w-full placeholder-GRAY_02 md:text-sm text-sm  bg-transparent focus:ring-transparent "
          placeholder={`${placeholder ?? ''}`}
        />
      </div>
      {errorMess && (
        <span className=" text-red-300 tmd:text-sm text-sm mt-1 h-4 w-full left-0 inline-block">
          {errorMess}
        </span>
      )}
    </div>
  );
}
