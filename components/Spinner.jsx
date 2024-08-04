import { Bars } from "react-loader-spinner";

const Spinner = () => {
  return (
    <Bars
      height="80"
      width="80"
      color="rgb(31 41 55)"
      ariaLabel="bars-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};

export default Spinner;
