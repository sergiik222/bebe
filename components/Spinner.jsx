import { Bars } from 'react-loader-spinner'

const Spinner = () => {
  return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <Bars
            height="120"
            width="150"
            color="white"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
      </div>
  )
}

export default Spinner
