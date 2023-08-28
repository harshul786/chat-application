import { BsPersonFill } from "react-icons/bs";

export default function DefaultProfile(props) {
  return (
    <div
      className="h-7 w-7 rounded-full flex justify-center items-center bg-gray-300"
      style={{ width: props.width, height: props.height }}
    >
      <BsPersonFill
        size={props.size}
        onClick={props.onclick}
        className="text-gray-50 dark:text-gray-900 cursor-pointer hover:scale-[1.06] duration-150"
      />
    </div>
  );
}
