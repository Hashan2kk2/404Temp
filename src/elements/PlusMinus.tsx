import React from "react";
import {BsDash, BsPlus} from "react-icons/bs";

const PlusMinus = ({
  getter,
  setter,
  handler,
}: {
  getter: number;
  setter: React.Dispatch<React.SetStateAction<number>>;
  handler?: any;
}) => {
  return (
    <div className={`w-fit flex gap-x-3 items-center justify-center`}>
      <button
        className={`w-8 h-8 rounded-full flex justify-center items-center border border-neutral-400`}
        onClick={() => {
          if (getter > 0) {
            setter(getter - 1);
          }
          handler?.(handler());
        }}
      >
        <BsDash />
      </button>
      <span className={`min-w-8 text-center`}>{getter}</span>
      <button
        className={`w-8 h-8 rounded-full flex justify-center items-center border border-neutral-400`}
        onClick={() => {
          setter(getter + 1);
          handler?.(handler());
        }}
      >
        <BsPlus />
      </button>
    </div>
  );
};

export default PlusMinus;
