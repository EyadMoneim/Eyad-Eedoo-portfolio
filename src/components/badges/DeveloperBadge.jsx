import laurelWreathSrc from "../../assets/Laurel_Wreath.svg";
import reactLogoSrc from "../../assets/react.svg";

export default function DeveloperBadge() {
  return (
    <div className="developer-badge">
      <img src={laurelWreathSrc} alt="Laurel Wreath" className="developer-badge-wreath" />
      <img src={reactLogoSrc} alt="React Logo" className="developer-badge-react" />
    </div>
  );
}
