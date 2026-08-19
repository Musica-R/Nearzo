import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { GROUP_TO_PROVIDER_TYPE } from "../../api/lokalApi";
import "./ServiceCard.css";

const ServiceCard = ({ item }) => {
  const Icon = Icons[item.icon] || Icons.Sparkles;
  const providerType = GROUP_TO_PROVIDER_TYPE[item.groupId] || "vendor";

  return (
    <Link to={`/category/${providerType}/${item.id}`} className="lk-service-tile">
      <div className="lk-service-tile-media">
        <img src={item.image} alt={item.name} loading="lazy" />
        <span className="lk-service-tile-tag">{item.groupTitle}</span>
      </div>
      <div className="lk-service-tile-body">
        <span className="lk-service-tile-icon">
          <Icon size={16} />
        </span>
        <h4>{item.name}</h4>
        <span className="lk-service-tile-cta">
          Explore <ArrowUpRight size={13} />
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;