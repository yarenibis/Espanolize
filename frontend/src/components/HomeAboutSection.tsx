import "./HomeAboutSection.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import heroImg from "../assets/Viva España.jpg";
import pngone from "../assets/png1.png";

export default function HomeAboutSection() {
  return (
    <div className="about-wrapper">

      {/* ---- LEFT IMAGE + TEXT ---- */}
      <div className="about-top">
        <div className="about-image-box">
          <img
            src={pngone}
            alt="About"
            className="about-main-image"
          />
        </div>

        <div className="about-text-box">
          <h2 className="about-title">We empower small business owners</h2>
          <p className="about-desc">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>

          <blockquote className="about-quote">
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.”
          </blockquote>

          
        </div>
      </div>

      
    </div>
  );
}
