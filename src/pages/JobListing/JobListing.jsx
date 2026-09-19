import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Clock,
  IndianRupee,
  Loader2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import LocationBar from "../../components/LocationBar/LocationBar";
import {
  fetchJobs,
  normalizeJob,
  formatSalary,
  formatExperience,
  getLogoUrl,
} from "../../api/lokalApi";
import "./JobListing.css";

const PER_PAGE = 6;

function initialsForCompany(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Reset to page 1 whenever the location filter changes
  useEffect(() => {
    setPage(1);
  }, [location]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchJobs({
      cityId: location?.cityId,
      latitude: location?.latitude,
      longitude: location?.longitude,
      radius: location?.radius,
      page,
      perPage: PER_PAGE,
    })
      .then((data) => {
        if (cancelled) return;
        setLastPage(data?.meta?.lastPage || 1);
        const normalized = (data || []).map(normalizeJob);
        setJobs(normalized);
        setError(null);
      })
      .catch(() => !cancelled && setError("Couldn't load job openings right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [location, page]);

  const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div className="section joblist-page">
      <div className="con">
        <SectionHeader
          eyebrow="Careers"
          title="Career Opportunities"
          subtitle="Open roles from verified companies near you."
        />

        <div className="joblist-toolbar">
          <LocationBar onChange={setLocation} />
        </div>

        <div className="joblist-layout">
          <div className="joblist-main">
            {loading && (
              <p className="text-muted">
                <Loader2 className="spin" size={16} /> Loading job openings...
              </p>
            )}
            {!loading && error && <p className="text-muted">{error}</p>}
            {!loading && !error && jobs.length === 0 && (
              <p className="text-muted">No job openings listed yet.</p>
            )}

            {!loading && !error && jobs.length > 0 && (
              <>
                <div className="joblist-grid">
                  {jobs.map((job) => {
                    const logoUrl = getLogoUrl(job.logo);
                    return (
                      <div className="job-card" key={job.id}>
                        <div className="job-card-top">
                          <div className="job-card-logo">
                            {logoUrl ? (
                              <img src={logoUrl} alt={job.companyName} />
                            ) : (
                              initialsForCompany(job.companyName) || <Briefcase size={20} />
                            )}
                          </div>
                          <span className="job-card-verified">
                            <ShieldCheck size={12} /> Verified Company
                          </span>
                        </div>

                        <p className="job-card-company">{job.companyName}</p>
                        <h4 className="job-card-title">{job.jobTitle}</h4>

                        <div className="job-card-meta">
                          {job.jobType && <span>{job.jobType}</span>}
                          {formatExperience(job) && (
                            <span>
                              <Clock size={12} /> {formatExperience(job)}
                            </span>
                          )}
                        </div>

                        {formatSalary(job) && (
                          <p className="job-card-salary">
                            <IndianRupee size={13} /> {formatSalary(job)}
                          </p>
                        )}

                        <Link to={`/careers/${job.id}`} className="job-card-btn">
                          View Details <ChevronRight size={14} />
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {lastPage > 1 && (
                  <div className="joblist-pagination">
                    <button
                      type="button"
                      className="joblist-pagination-btn joblist-pagination-nav"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>

                    {pageNumbers.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`joblist-pagination-btn joblist-pagination-num ${
                          n === page ? "is-active" : ""
                        }`}
                        onClick={() => setPage(n)}
                        disabled={loading}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="joblist-pagination-btn joblist-pagination-nav"
                      onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                      disabled={page === lastPage || loading}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="joblist-warning-card">
            <div className="joblist-warning-card-icon">
              <ShieldAlert size={22} />
            </div>
            <h4>Important Notice</h4>
            <ul className="joblist-warning-card-list">
              <li>The employer is solely responsible for the accuracy of this listing and the hiring process.</li>
              <li>The website owner is not involved in recruitment, interviews, or employment terms.</li>
              <li>Never pay money to anyone claiming to guarantee a job offer.</li>
              <li>Verify the company directly before sharing personal documents.</li>
            </ul>
            <div className="joblist-warning-safe">
              <ShieldCheck size={16} /> Stay Safe <span>Be Aware</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobListing;