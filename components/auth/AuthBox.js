import Image from "next/image";

const AuthBox = ({ children }) => (
  <div className="w-full h-[90vh] flex items-center justify-center ">
    <div className="md:p-12 md:pb-12 p-6 pb-6 md:rounded-2xl rounded shadow-centerbox w-[400px] flex flex-col justify-between bg-white">
      <div className="">
        <Image
          priority
          className="h-auto"
          src="/img/logo.webp"
          width={512}
          height={512}
          alt="alt"
        />
      </div>

      {children}
      <div className="text-[12px] text-gray-300 text-center mt-6">
        footer text
      </div>
    </div>
  </div>
);
export default AuthBox;
