import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from '../../assets/camera_spinner.json'

const SpinnerCamera = () => {
  return (
      <div className="fixed inset-0 flex justify-center items-center bg-background bg-opacity-50 z-50">
       <Lottie animationData={animationData} />
      </div>
  )
}

export default SpinnerCamera
