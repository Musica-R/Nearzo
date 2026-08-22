import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  ChevronDown,
  LayoutGrid,
  Zap,
  Wrench,
  Fan,
  PaintRoller,
  Sparkles,
  Car,
  Droplet,
  Camera,
  Bug,
  Settings,
  BookOpen,
  Trophy,
  Dumbbell,
  Music2,
  Palette,
  Mic,
  Brain,
  Waves,
  Users,
  ArrowRight,
} from "lucide-react";
import "./CategorySidebar.css";

const CATEGORY_VISUALS = [
  { match: "electric", icon: Zap, color: "#ef4444" },
  { match: "plumb", icon: Wrench, color: "#3b82f6" },
  { match: "ac repair", icon: Fan, color: "#14b8a6" },
  { match: "ac service", icon: Fan, color: "#14b8a6" },
  { match: "paint", icon: PaintRoller, color: "#eab308" },
  { match: "housekeep", icon: Sparkles, color: "#f97316" },
  { match: "car wash", icon: Car, color: "#3b82f6" },
  { match: "ro service", icon: Droplet, color: "#06b6d4" },
  { match: "cctv", icon: Camera, color: "#6366f1" },
  { match: "pest", icon: Bug, color: "#a855f7" },
  { match: "appliance", icon: Settings, color: "#f97316" },
  { match: "tuition", icon: BookOpen, color: "#8b5cf6" },
  { match: "karate", icon: Trophy, color: "#ef4444" },
  { match: "gym", icon: Dumbbell, color: "#16a34a" },
  { match: "dance", icon: Music2, color: "#ec4899" },
  { match: "draw", icon: Palette, color: "#f59e0b" },
  { match: "music", icon: Music2, color: "#6366f1" },
  { match: "spoken english", icon: Mic, color: "#0ea5e9" },
  { match: "meditation", icon: Brain, color: "#14b8a6" },
  { match: "yoga", icon: Waves, color: "#22c55e" },
];

const FALLBACK_COLORS = ["#ef4444", "#3b82f6", "#14b8a6", "#eab308", "#f97316", "#a855f7", "#22c55e", "#6366f1"];

const getCategoryVisual = (name = "") => {
  const lower = name.toLowerCase();
  const found = CATEGORY_VISUALS.find((v) => lower.includes(v.match));
  if (found) return found;

  let hash = 0;
  for (let i = 0; i < lower.length; i++) hash = (hash * 31 + lower.charCodeAt(i)) >>> 0;
  return { icon: LayoutGrid, color: FALLBACK_COLORS[hash % FALLBACK_COLORS.length] };
};

const CategorySidebar = ({
  categories = [],
  activeId,
  onSelect,
  counts = {},
  title = "Categories",
  becomeVendorHref = "/become-vendor",
}) => {
  const [expanded, setExpanded] = useState(true);

  const getCount = (cat) => counts[cat.id] ?? counts[cat.name] ?? 0;

  return (
    <aside className="category-sidebar">
      <button
        className="category-sidebar-filters-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="category-sidebar-filters-label">
          <Filter size={16} /> Filters
        </span>
        <ChevronDown size={16} className={`category-sidebar-chevron ${expanded ? "open" : ""}`} />
      </button>

      {expanded && (
        <>
          <h3 className="category-sidebar-title">{title}</h3>

          <div className="category-sidebar-list">
            <button
              className={`category-sidebar-item category-sidebar-all ${!activeId ? "active" : ""}`}
              onClick={() => onSelect(null)}
            >
              <span className="category-sidebar-item-icon category-sidebar-all-icon">
                <LayoutGrid size={16} />
              </span>
              <span className="category-sidebar-item-name">All Categories</span>
            </button>

            {categories.map((cat) => {
              const { icon: Icon, color } = getCategoryVisual(cat.name);
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => onSelect(cat.id)}
                >
                  <span
                    className="category-sidebar-item-icon"
                    style={{ color, background: `${color}1a` }}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="category-sidebar-item-name">{cat.name}</span>
                  <span className="category-sidebar-item-count">({getCount(cat)})</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="category-sidebar-cta">
        <span className="category-sidebar-cta-icon">
          <Users size={20} />
        </span>
        <p className="category-sidebar-cta-text">
          Can't find what you need? Become a vendor and offer your services
        </p>
        <Link to={becomeVendorHref} className="category-sidebar-cta-btn">
          Become Vendor <ArrowRight size={14} />
        </Link>
      </div>
    </aside>
  );
};

export default CategorySidebar;