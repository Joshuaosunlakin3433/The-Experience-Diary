import { assets } from "../assets/assets";
const Header = () => {
  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex gap-2 items-center justify-center mb-4 border border-primary/40 bg-primary/10 px-2 py-1 rounded-full text-sm text-primary">
          <p>New: AI feature integrated</p>
          <img src={assets.star_icon} alt="star icon" className="w-2.5" />
        </div>
        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          Your personal <span className="text-primary">narrative</span> <br />{" "}
          space
        </h1>
        <p className="my-6 sm:my-8 max-w-2xl mx-auto max-sm:text-xs text-gray-500">
          This is your space to explore thoughts, to record what inspires you,
          and to create without constraints. Whether it's a feeling or an
          adventure, your narrative starts right here.
        </p>

        <form className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search for blogs"
            className="w-full pl-4 outline-none "
            required
          />
          <button  
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>
      <img
        src={assets.gradientBackground}
        alt="background"
        className="absolute -top-50 -z-1"
      />
    </div>
  );
};

export default Header;
