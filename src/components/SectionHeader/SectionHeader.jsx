import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./SectionHeader.css";

const SectionHeader = ({ eyebrow, title, subtitle, linkTo, linkLabel = "View all" }) => (
  <div className="section-header">
    <div>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
    {linkTo && (
      <Link to={linkTo} className="link-arrow">
        {linkLabel} <ArrowRight size={15} />
      </Link>
    )}
  </div>
);

export default SectionHeader;
