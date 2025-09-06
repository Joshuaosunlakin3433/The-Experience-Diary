import { assets, footer_data } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-theme-secondary">
      <div className="flex flex-col md:flex-row item-start justify-between gap-1 py-10 border-b border-theme-primary text-theme-muted">
        <div>
          <img
            src={assets.ED_logo}
            alt="Experience Diary Logo"
            className="ed-logo-footer"
          />
          <p className="max-w-[410px] mt-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias,
            officia tenetur. Est nam explicabo a aspernatur sunt facilis,
            molestiae voluptatem veniam eveniet iure, laborum fuga quaerat nihil
            labore porro dicta!
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-theme-primary md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:underline transition-all ease-in-out duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-theme-muted">
        Copyright 2025 &copy; The Experience Diary Dr C.J - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
