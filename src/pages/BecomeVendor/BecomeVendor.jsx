import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  Check,
  X,
  Store,
  Sparkles,
  MapPin,
  ImagePlus,
  IndianRupee,
  Users,
  ShieldCheck,
  Zap,
  User,
  Phone,
  MessageCircle,
  Tag,
  Briefcase,
  CalendarDays,
  Clock,
  Building2,
  Hash,
  Link2,
  Award,
  ListChecks,
} from "lucide-react";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import { getCategories } from "../../redux/slices/categorySlice";
import { getCities } from "../../redux/slices/citySlice";
import {
  getActivityCategories,
  clearActivityCategories,
} from "../../redux/slices/activityCategorySlice";
import { submitVendorRegistration, resetVendorState } from "../../redux/slices/vendorSlice";
import "./BecomeVendor.css";
import customerpic from "../../assets/customer.jpg"

const TABS = [
  { key: "service", label: "Service Vendor", icon: Store },
  { key: "activity", label: "Activity Provider", icon: Sparkles },
  { key: "stall", label: "Nearby Stall", icon: MapPin },
];

const ACTIVITY_TYPES = ["Learning & Training", "Sports & Fitness"];

const PROMO_POINTS = [
  { icon: Users, text: "Get discovered by thousands of nearby customers" },
  { icon: Zap, text: "Go live in minutes after a quick verification" },
  { icon: ShieldCheck, text: "Free listing — no fees to get started" },
];

const HERO_COPY = {
  service: {
    title: "List Your Service",
    sub: "List your service under your account — it's free and goes live after a quick review.",
  },
  activity: {
    title: "List Your Activity",
    sub: "List your activity or center — it's free and goes live after a quick review.",
  },
  stall: {
    title: "List Your Stall",
    sub: "List your stall under your account — it's free and goes live after a quick review.",
  },
};

const initialState = {
  type: "service",
  full_name: "",
  business_name: "",
  shop_center_name: "",
  shop_name: "",
  phone_number: "",
  whatsapp_number: "",
  category_id: "",
  subcategory_ids: [],
  subcategory_name: "",        // temp text being typed
  subcategory_custom_names: [], // list of custom sub-categories added by the user
  activity_type: "",       // UI-only, not sent to backend
  activity_category_id: "", // UI-only, not sent to backend
  activity: "",             // this is what actually gets submitted
  experience: "",
  price: "",
  availability_type: "all_days",
  working_from: "09:00",
  working_to: "18:00",
  address_line1: "",
  address_line2: "",
  city_id: "",
  pincode: "",
  badge: "Verified",
  google_map_link: "",
  profile_photo: null,
  shop_photo: null,
  shop_photo2: null,
  shop_photo3: null,
};

/* Small wrapper: icon-prefixed input/select "pill" field */
const Field = ({ icon: Icon, children }) => (
  <div className="bv-field">
    <Icon size={15} className="bv-field-icon" />
    {children}
  </div>
);

const BecomeVendor = () => {
  const dispatch = useDispatch();
  const { list: categories } = useSelector((s) => s.category);
  const homeServiceCategories = categories.filter((c) => c.type === "Home Services");
  const { list: cities } = useSelector((s) => s.city);
  const { list: activityCategories, loading: activityCategoriesLoading } = useSelector(
    (s) => s.activityCategory
  );
  const { loading, success, error } = useSelector((s) => s.vendor);
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getCities());
    return () => {
      dispatch(resetVendorState());
      dispatch(clearActivityCategories());
    };
  }, [dispatch]);

  const handleTypeChange = (type) => {
    setForm((prev) => ({ ...initialState, type, city_id: prev.city_id }));
    dispatch(resetVendorState());
    dispatch(clearActivityCategories());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      setForm((prev) => ({ ...prev, category_id: value, subcategory_ids: [] }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubcategoryToggle = (id) => {
    setForm((prev) => ({
      ...prev,
      subcategory_ids: prev.subcategory_ids.includes(id)
        ? prev.subcategory_ids.filter((i) => i !== id)
        : [...prev.subcategory_ids, id],
    }));
  };

  const handleAddCustomSubcategory = () => {
    const name = form.subcategory_name.trim();
    if (!name) return;
    setForm((prev) => ({
      ...prev,
      subcategory_custom_names: prev.subcategory_custom_names.includes(name)
        ? prev.subcategory_custom_names
        : [...prev.subcategory_custom_names, name],
      subcategory_name: "",
    }));
  };

  const handleCustomSubcategoryKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddCustomSubcategory();
    }
  };

  const handleRemoveCustomSubcategory = (name) => {
    setForm((prev) => ({
      ...prev,
      subcategory_custom_names: prev.subcategory_custom_names.filter((n) => n !== name),
    }));
  };

  const handleActivityTypeChange = (e) => {
    const type = e.target.value;
    setForm((prev) => ({ ...prev, activity_type: type, activity_category_id: "", activity: "" }));
    if (type) {
      dispatch(getActivityCategories(type));
    } else {
      dispatch(clearActivityCategories());
    }
  };

  const handleActivityCategoryChange = (e) => {
    const id = e.target.value;
    const selected = activityCategories.find((c) => String(c.id) === String(id));
    setForm((prev) => ({
      ...prev,
      activity_category_id: id,
      activity: selected ? selected.name : "",
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const buildFormData = () => {
    const fd = new FormData();

    if (form.type === "service") {
      fd.append("role", "vendor");
      fd.append("full_name", form.full_name);
      fd.append("business_name", form.business_name);
      fd.append("phone_number", form.phone_number);
      fd.append("whatsapp_number", form.whatsapp_number);
      fd.append("category_id", form.category_id);
      form.subcategory_ids.forEach((id) => fd.append("subcategory_id[]", id));
      form.subcategory_custom_names.forEach((name) => fd.append("subcategory_name[]", name));
      fd.append("experience", form.experience);
      fd.append("price", form.price);
      fd.append("availability_type", form.availability_type);
      fd.append("working_from", `${form.working_from}:00`);
      fd.append("working_to", `${form.working_to}:00`);
      fd.append("address_line1", form.address_line1);
      fd.append("address_line2", form.address_line2);
      fd.append("city_id", form.city_id);
      fd.append("pincode", form.pincode);
      fd.append("google_map_link", form.google_map_link);
      if (form.profile_photo) fd.append("profile_photo", form.profile_photo);
    }

    if (form.type === "activity") {
      fd.append("role", "vendor");
      fd.append("full_name", form.full_name);
      fd.append("shop_center_name", form.shop_center_name);
      fd.append("phone_number", form.phone_number);
      fd.append("whatsapp_number", form.whatsapp_number);
      fd.append("category_id", form.activity_category_id);// only the resolved name is sent
      fd.append("experience", form.experience);
      fd.append("price", form.price);
      fd.append("availability_type", form.availability_type);
      fd.append("working_from", form.working_from);
      fd.append("working_to", form.working_to);
      fd.append("address_line1", form.address_line1);
      fd.append("address_line2", form.address_line2);
      fd.append("city_id", form.city_id);
      fd.append("pincode", form.pincode);
      fd.append("google_map_link", form.google_map_link);
      if (form.profile_photo) fd.append("profile_photo", form.profile_photo);
    }

    if (form.type === "stall") {
      fd.append("role", "vendor");
      fd.append("shop_name", form.shop_name);
      fd.append("phone_number", form.phone_number);
      fd.append("whatsapp_number", form.whatsapp_number);
      fd.append("badge", form.badge);
      fd.append("price", form.price);
      fd.append("address_line1", form.address_line1);
      fd.append("address_line2", form.address_line2);
      fd.append("city_id", form.city_id);
      fd.append("pincode", form.pincode);
      fd.append("google_map_link", form.google_map_link);
      fd.append("working_from", form.working_from);
      fd.append("working_to", form.working_to);
      if (form.shop_photo) fd.append("shop_photo", form.shop_photo);
      if (form.shop_photo2) fd.append("shop_photo2", form.shop_photo2);
      if (form.shop_photo3) fd.append("shop_photo3", form.shop_photo3);
    }

    return fd;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitVendorRegistration({ type: form.type, formData: buildFormData() }));
  };

  const hero = HERO_COPY[form.type];
  const selectedCategory = homeServiceCategories.find((c) => String(c.id) === String(form.category_id));

  return (
    <div className="lk-home section become-vendor-page">
      <div className="container">
        <SectionHeader
          eyebrow="Grow with Lokal"
          title="Become a Vendor"
          subtitle="List your service, activity, or stall and get discovered by thousands of nearby customers."
        />

        <div className="bv-tabs">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`bv-tab ${form.type === key ? "active" : ""}`}
              onClick={() => handleTypeChange(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="bv-layout">
          {/* ---------------- FORM CARD ---------------- */}
          <div className="bv-form-col">
            {success ? (
              <div className="bv-card bv-success">
                <div className="bv-success-icon">
                  <CheckCircle2 size={36} />
                </div>
                <h3>Application submitted!</h3>
                <p className="text-muted">
                  We've received your details. Our team will verify and get back to you shortly.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => { setForm(initialState); dispatch(resetVendorState()); dispatch(clearActivityCategories()); }}
                >
                  Register another
                </button>
              </div>
            ) : (
              <form className="bv-card bv-form" onSubmit={handleSubmit}>
                {/* ---------------- HERO BANNER ---------------- */}
                <div className="bv-hero">
                  <h2 className="bv-hero-title">{hero.title}</h2>
                  <p className="bv-hero-sub">{hero.sub}</p>
                </div>

                <div className="bv-form-body">
                  <div className="bv-form-icon">
                    <span className="bv-form-icon-badge">
                      <Store size={18} />
                    </span>
                    <span className="bv-form-icon-title">
                      {form.type === "service" && "Business Details"}
                      {form.type === "activity" && "Activity Details"}
                      {form.type === "stall" && "Stall Details"}
                    </span>
                  </div>

                  <div className="bv-grid">
                    {/* ---------------- SERVICE ---------------- */}
                    {form.type === "service" && (
                      <>
                        <label>
                          <span className="bv-label-text">Full Name <span className="req">*</span></span>
                          <Field icon={User}>
                            <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="e.g. Kavin" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Phone Number <span className="req">*</span></span>
                          <Field icon={Phone}>
                            <input name="phone_number" value={form.phone_number} onChange={handleChange} required placeholder="9876543210" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Business Name</span>
                          <Field icon={Store}>
                            <input name="business_name" value={form.business_name} onChange={handleChange} placeholder="e.g. Kavin Electronics" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">WhatsApp Number</span>
                          <Field icon={MessageCircle}>
                            <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="9876543210" />
                          </Field>
                        </label>

                        <label>
                          <span className="bv-label-text">Category <span className="req">*</span></span>
                          <Field icon={Tag}>
                            <select name="category_id" value={form.category_id} onChange={handleChange} required>
                              <option value="">Select category</option>
                              {homeServiceCategories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </Field>
                        </label>

                        {/* ---- Sub-category: row list with tick ---- */}
                        <label className="bv-span-2">
                          <span className="bv-label-text">Sub-category</span>
                          {!form.category_id && <p className="bv-hint">Select a category first</p>}
                          {selectedCategory?.sub_categories?.length > 0 && (
                            <div className="bv-subcat-rows">
                              {selectedCategory.sub_categories.map((sub) => {
                                const active = form.subcategory_ids.includes(sub.id);
                                return (
                                  <label key={sub.id} className={`bv-subcat-row ${active ? "active" : ""}`}>
                                    <input
                                      type="checkbox"
                                      checked={active}
                                      onChange={() => handleSubcategoryToggle(sub.id)}
                                    />
                                    <span className="bv-subcat-tick">
                                      {active && <Check size={12} />}
                                    </span>
                                    <span className="bv-subcat-row-label">{sub.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </label>

                        {/* ---- Custom sub-category: multi tag input ---- */}
                        <label className="bv-span-2">
                          <span className="bv-label-text">Sub-category not listed? Type it here</span>
                          <Field icon={Tag}>
                            <input
                              name="subcategory_name"
                              value={form.subcategory_name}
                              onChange={handleChange}
                              onKeyDown={handleCustomSubcategoryKeyDown}
                              placeholder="e.g. Aquarium Cleaning — press Enter to add"
                            />
                            <button
                              type="button"
                              className="bv-tag-add-btn"
                              onClick={handleAddCustomSubcategory}
                            >
                              Add
                            </button>
                          </Field>
                          {form.subcategory_custom_names.length > 0 && (
                            <div className="bv-tag-list">
                              {form.subcategory_custom_names.map((name) => (
                                <span key={name} className="bv-tag">
                                  {name}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCustomSubcategory(name)}
                                    aria-label={`Remove ${name}`}
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </label>

                        <label>
                          <span className="bv-label-text">Experience</span>
                          <Field icon={Briefcase}>
                            <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5 Years" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Price (starting from) <span className="req">*</span></span>
                          <Field icon={IndianRupee}>
                            <input type="number" min="0" step="1" name="price" value={form.price} onChange={handleChange} required placeholder="e.g. 499" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Availability</span>
                          <Field icon={CalendarDays}>
                            <select name="availability_type" value={form.availability_type} onChange={handleChange}>
                              <option value="all_days">All Days</option>
                              <option value="weekdays">Weekdays Only</option>
                              <option value="weekends">Weekends Only</option>
                            </select>
                          </Field>
                        </label>

                        <label>
                          <span className="bv-label-text">Working From</span>
                          <Field icon={Clock}>
                            <input type="time" name="working_from" value={form.working_from} onChange={handleChange} />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Working To</span>
                          <Field icon={Clock}>
                            <input type="time" name="working_to" value={form.working_to} onChange={handleChange} />
                          </Field>
                        </label>

                        <label className="bv-span-2 bv-file">
                          <span className="bv-label-text"><ImagePlus size={14} /> Profile Photo (optional)</span>
                          <input type="file" name="profile_photo" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} />
                        </label>
                      </>
                    )}

                    {/* ---------------- ACTIVITY ---------------- */}
                    {form.type === "activity" && (
                      <>
                        <label>
                          <span className="bv-label-text">Full Name <span className="req">*</span></span>
                          <Field icon={User}>
                            <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="e.g. Kavin" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Phone Number <span className="req">*</span></span>
                          <Field icon={Phone}>
                            <input name="phone_number" value={form.phone_number} onChange={handleChange} required placeholder="9876543210" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Shop / Center Name</span>
                          <Field icon={Store}>
                            <input name="shop_center_name" value={form.shop_center_name} onChange={handleChange} placeholder="e.g. Sunrise Play Zone" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">WhatsApp Number</span>
                          <Field icon={MessageCircle}>
                            <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="9876543210" />
                          </Field>
                        </label>

                        <label>
                          <span className="bv-label-text">Activity Type <span className="req">*</span></span>
                          <Field icon={Sparkles}>
                            <select name="activity_type" value={form.activity_type} onChange={handleActivityTypeChange} required>
                              <option value="">Select activity type</option>
                              {ACTIVITY_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Activity <span className="req">*</span></span>
                          <Field icon={ListChecks}>
                            <select
                              name="activity_category_id"
                              value={form.activity_category_id}
                              onChange={handleActivityCategoryChange}
                              required
                              disabled={!form.activity_type || activityCategoriesLoading}
                            >
                              <option value="">
                                {!form.activity_type
                                  ? "Select activity type first"
                                  : activityCategoriesLoading
                                    ? "Loading..."
                                    : "Select activity"}
                              </option>
                              {activityCategories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </Field>
                        </label>

                        <label>
                          <span className="bv-label-text">Experience</span>
                          <Field icon={Briefcase}>
                            <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 3 Years" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Price (starting from) <span className="req">*</span></span>
                          <Field icon={IndianRupee}>
                            <input type="number" min="0" step="1" name="price" value={form.price} onChange={handleChange} required placeholder="e.g. 299" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Availability</span>
                          <Field icon={CalendarDays}>
                            <select name="availability_type" value={form.availability_type} onChange={handleChange}>
                              <option value="all_days">All Days</option>
                              <option value="weekdays">Weekdays Only</option>
                              <option value="weekends">Weekends Only</option>
                            </select>
                          </Field>
                        </label>

                        <label>
                          <span className="bv-label-text">Working From</span>
                          <Field icon={Clock}>
                            <input type="time" name="working_from" value={form.working_from} onChange={handleChange} />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Working To</span>
                          <Field icon={Clock}>
                            <input type="time" name="working_to" value={form.working_to} onChange={handleChange} />
                          </Field>
                        </label>

                        <label className="bv-span-2 bv-file">
                          <span className="bv-label-text"><ImagePlus size={14} /> Profile Photo (optional)</span>
                          <input type="file" name="profile_photo" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} />
                        </label>
                      </>
                    )}

                    {/* ---------------- STALL ---------------- */}
                    {form.type === "stall" && (
                      <>
                        <label>
                          <span className="bv-label-text">Shop Name <span className="req">*</span></span>
                          <Field icon={Store}>
                            <input name="shop_name" value={form.shop_name} onChange={handleChange} required placeholder="e.g. Amma's Snacks Corner" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Phone Number <span className="req">*</span></span>
                          <Field icon={Phone}>
                            <input name="phone_number" value={form.phone_number} onChange={handleChange} required placeholder="9876543210" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">WhatsApp Number</span>
                          <Field icon={MessageCircle}>
                            <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="9876543210" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Badge</span>
                          <Field icon={Award}>
                            <select name="badge" value={form.badge} onChange={handleChange}>
                              <option value="Verified">Verified</option>
                              <option value="Popular">Popular</option>
                              <option value="New">New</option>
                            </select>
                          </Field>
                        </label>

                        <label>
                          <span className="bv-label-text">Price (starting from) <span className="req">*</span></span>
                          <Field icon={IndianRupee}>
                            <input type="number" min="0" step="1" name="price" value={form.price} onChange={handleChange} required placeholder="e.g. 49" />
                          </Field>
                        </label>
                        <label>
                          <span className="bv-label-text">Working From</span>
                          <Field icon={Clock}>
                            <input type="time" name="working_from" value={form.working_from} onChange={handleChange} />
                          </Field>
                        </label>
                        <label className="bv-span-2">
                          <span className="bv-label-text">Working To</span>
                          <Field icon={Clock}>
                            <input type="time" name="working_to" value={form.working_to} onChange={handleChange} />
                          </Field>
                        </label>

                        <label className="bv-file">
                          <span className="bv-label-text"><ImagePlus size={14} /> Shop Photo (required)</span>
                          <input type="file" name="shop_photo" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} required />
                        </label>
                        <label className="bv-file">
                          <span className="bv-label-text"><ImagePlus size={14} /> Shop Photo 2 (optional)</span>
                          <input type="file" name="shop_photo2" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} />
                        </label>
                        <label className="bv-file bv-span-2">
                          <span className="bv-label-text"><ImagePlus size={14} /> Shop Photo 3 (optional)</span>
                          <input type="file" name="shop_photo3" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange} />
                        </label>
                      </>
                    )}

                    {/* ---------------- SHARED ADDRESS BLOCK ---------------- */}
                    <label className="bv-span-2">
                      <span className="bv-label-text">Address Line<span className="req">*</span></span>
                      <Field icon={MapPin}>
                        <input name="address_line1" value={form.address_line1} onChange={handleChange} required placeholder="Address" />
                      </Field>
                    </label>
                    {/* <label className="bv-span-2">
                      <span className="bv-label-text">Address Line 2</span>
                      <Field icon={MapPin}>
                        <input name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Taluk / Landmark" />
                      </Field>
                    </label> */}

                    <label>
                      <span className="bv-label-text">City <span className="req">*</span></span>
                      <Field icon={Building2}>
                        <select name="city_id" value={form.city_id} onChange={handleChange} required>
                          <option value="">Select city</option>
                          {cities.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </Field>
                    </label>
                    <label>
                      <span className="bv-label-text">Pincode <span className="req">*</span></span>
                      <Field icon={Hash}>
                        <input name="pincode" value={form.pincode} onChange={handleChange} required placeholder="637102" />
                      </Field>
                    </label>

                    <label className="bv-span-2">
                      <span className="bv-label-text">Google Map Link</span>
                      <Field icon={Link2}>
                        <input name="google_map_link" value={form.google_map_link} onChange={handleChange} placeholder="https://maps.google.com/..." />
                      </Field>
                    </label>
                  </div>

                  {error && <p className="bv-error">{error}</p>}

                  <button type="submit" className="btn btn-primary btn-block bv-submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ---------------- PROMO CARD ---------------- */}
          <aside className="bv-promo">
            <div className="bv-promo-badge">100% Free</div>
            <h3 className="bv-promo-title">List your service here</h3>
            <p className="bv-promo-sub">
              Get in front of customers who are already looking nearby.
            </p>

            <div className="bv-promo-image">
              <img
                src={customerpic}
                alt="Happy customer discovering local businesses on Lokal"
              />
            </div>

            <ul className="bv-promo-points">
              {PROMO_POINTS.map(({ icon: Icon, text }, i) => (
                <li key={i}>
                  <span className="bv-promo-point-icon">
                    <Icon size={15} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="bv-promo-footer">
              <span className="bv-promo-footer-label">Get customers here</span>
              <span className="bv-promo-footer-sub">Your listing goes live after a quick review</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BecomeVendor;