
import { FC } from "react";
import { CreateCounter } from "components/CreateCounter";
import { UpdateCounter } from "components/UpdateCounter";
import { GetCounter } from "components/GetCounter";

export const BasicsView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Counter App
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <CreateCounter />
          <UpdateCounter />
          <GetCounter />
        </div>
      </div>
    </div>
  );
};
