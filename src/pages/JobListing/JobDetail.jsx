import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Briefcase,
    MapPin,
    IndianRupee,
    GraduationCap,
    Users,
    CalendarDays,
    Loader2,
    ArrowLeft,
    ShieldAlert,
    Building2,
    Link2,
    Share2,
    Flag,
} from "lucide-react";
import { fetchJobById, formatSalary, formatExperience, formatDeadline, getLogoUrl } from "../../api/lokalApi";
import "./JobDetail.css";

function initialsForCompany(name = "") {
    return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// Turns a paragraph field into short bullet points for the "Job highlights" card.
function toBullets(text, max = 4) {
    if (!text) return [];
    return text
        .split(/\r?\n|(?<=[.])\s+(?=[A-Z])/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, max);
}

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchJobById(id)
            .then((data) => {
                if (cancelled) return;
                if (!data) setError("This job listing couldn't be found.");
                else setJob(data);
            })
            .catch(() => !cancelled && setError("Couldn't load this job right now."))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="section job-detail-page">
                <div className="con">
                    <p className="job-detail-status">
                        <Loader2 className="job-spin" size={16} /> Loading job details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="section job-detail-page">
                <div className="con">
                    <p className="job-detail-status">{error || "Job not found."}</p>
                    <Link to="/careers" className="job-detail-back">
                        <ArrowLeft size={14} /> Back to Career Opportunities
                    </Link>
                </div>
            </div>
        );
    }

    const skills = job.skills ? job.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const deadline = formatDeadline(job.applicationDeadline);
    const highlights = toBullets(job.requirements || job.description);

    return (
        <div className="section job-detail-page">
            <div className="con">
                <Link to="/careers" className="job-detail-back">
                    <ArrowLeft size={14} /> Back to Career Opportunities
                </Link>

                <div className="job-detail-layout">
                    <div className="job-detail-main">
                        {/* ---------------- TITLE CARD ---------------- */}
                        <div className="job-detail-card job-detail-title-card">
                            <div className="job-detail-title-row">
                                <div className="job-detail-title-text">
                                    <h1>{job.jobTitle}</h1>
                                    <p className="job-detail-company">
                                        <Building2 size={14} /> {job.companyName}
                                    </p>

                                    <div className="job-detail-meta-row">
                                        {formatExperience(job) && (
                                            <span className="job-detail-meta">
                                                <Briefcase size={13} /> {formatExperience(job)}
                                            </span>
                                        )}
                                        {formatSalary(job) && (
                                            <span className="job-detail-meta">
                                                <IndianRupee size={13} /> {formatSalary(job)}
                                            </span>
                                        )}
                                        {job.location && (
                                            <span className="job-detail-meta">
                                                <MapPin size={13} /> {job.location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className="job-detail-logo"

                                >
                                    {job.logo ? (
                                        <img
                                            src={getLogoUrl(job.logo)}
                                            alt={job.companyName}
                                            className="job-detail-logo-img"
                                        />
                                    ) : (
                                        initialsForCompany(job.companyName) || <Briefcase size={26} />
                                    )}
                                </div>
                            </div>

                            <div className="job-detail-stats-row">
                                {job.vacancies != null && <span>Openings <b>{job.vacancies}</b></span>}
                                {job.jobType && <span>Type <b>{job.jobType}</b></span>}
                                {job.workMode && <span>Mode <b>{job.workMode}</b></span>}
                                {job.shift && <span>Shift <b>{job.shift}</b></span>}
                            </div>
                        </div>

                        {/* ---------------- HIGHLIGHTS CARD ---------------- */}
                        {highlights.length > 0 && (
                            <div className="job-detail-card">
                                <h3 className="job-detail-heading">Job highlights</h3>
                                <ul className="job-detail-bullets">
                                    {highlights.map((line, i) => (
                                        <li key={i}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* ---------------- DESCRIPTION CARD ---------------- */}
                        <div className="job-detail-card">
                            {job.description && (
                                <section className="job-detail-section">
                                    <h3 className="job-detail-heading">Job description</h3>
                                    <p>{job.description}</p>
                                </section>
                            )}

                            {job.responsibilities && (
                                <section className="job-detail-section">
                                    <h4 className="job-detail-subheading">Role &amp; responsibilities</h4>
                                    <p>{job.responsibilities}</p>
                                </section>
                            )}

                            {job.requirements && (
                                <section className="job-detail-section">
                                    <h4 className="job-detail-subheading">Requirements</h4>
                                    <p>{job.requirements}</p>
                                </section>
                            )}

                            {job.benefits && (
                                <section className="job-detail-section">
                                    <h4 className="job-detail-subheading">Benefits</h4>
                                    <p>{job.benefits}</p>
                                </section>
                            )}

                            {job.qualification && (
                                <section className="job-detail-section">
                                    <h4 className="job-detail-subheading">Education</h4>
                                    <p>{job.qualification}</p>
                                </section>
                            )}

                            {skills.length > 0 && (
                                <section className="job-detail-section">
                                    <h4 className="job-detail-subheading">Key skills</h4>
                                    <div className="job-detail-skills">
                                        {skills.map((s) => (
                                            <span key={s} className="job-detail-skill">{s}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {job.mapLink && (
                                <section className="job-detail-section">
                                    <h4 className="job-detail-subheading">Location</h4>
                                    <a href={job.mapLink} target="_blank" rel="noopener noreferrer" className="job-detail-map-link">
                                        <Link2 size={13} /> View on Google Maps
                                    </a>
                                </section>
                            )}

                        </div>

                        {/* ---------------- NOTICE CARD ---------------- */}
                        <div className="job-detail-card job-detail-warning-card">
                            <div className="job-detail-warning-head">
                                <ShieldAlert size={18} />
                                <h3 className="job-detail-heading job-detail-heading-warn">Beware of imposters</h3>
                            </div>
                            <ul>
                                <li>The employer is solely responsible for the accuracy of this listing and the hiring process.</li>
                                <li>The website owner is not involved in recruitment, interviews, or employment terms.</li>
                                <li>Never pay money to anyone claiming to guarantee a job offer.</li>
                                <li>Verify the company directly before sharing personal documents.</li>
                            </ul>
                        </div>
                    </div>

                    {/* ---------------- SIDEBAR ---------------- */}
                    <aside className="job-detail-sidebar">
                        <div className="job-detail-card job-detail-facts-card">
                            <h4 className="job-detail-heading">Job overview</h4>
                            <ul className="job-detail-facts-list">
                                {job.qualification && (
                                    <li>
                                        <GraduationCap size={15} />
                                        <div>
                                            <span className="job-detail-fact-label">Qualification</span>
                                            <span className="job-detail-fact-value">{job.qualification}</span>
                                        </div>
                                    </li>
                                )}
                                {job.vacancies != null && (
                                    <li>
                                        <Users size={15} />
                                        <div>
                                            <span className="job-detail-fact-label">Vacancies</span>
                                            <span className="job-detail-fact-value">{job.vacancies} openings</span>
                                        </div>
                                    </li>
                                )}
                                {job.gender && (
                                    <li>
                                        <Users size={15} />
                                        <div>
                                            <span className="job-detail-fact-label">Preferred Gender</span>
                                            <span className="job-detail-fact-value">{job.gender}</span>
                                        </div>
                                    </li>
                                )}
                                {formatDeadline(job.applicationDeadline) && (
                                    <li>
                                        <CalendarDays size={15} />
                                        <div>
                                            <span className="job-detail-fact-label">Apply By</span>
                                            <span className="job-detail-fact-value">{formatDeadline(job.applicationDeadline)}</span>
                                        </div>
                                    </li>
                                )}
                                {(job.cityName || job.location) && (
                                    <li>
                                        <MapPin size={15} />
                                        <div>
                                            <span className="job-detail-fact-label">City</span>
                                            <span className="job-detail-fact-value">{job.cityName || job.location}</span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;