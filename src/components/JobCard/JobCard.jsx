import { Link } from "react-router-dom";
import { Briefcase, Building2, BadgeCheck, ArrowRight } from "lucide-react";
import { getLogoUrl, formatSalary, formatExperience } from "../../api/lokalApi";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const logoUrl = getLogoUrl(job.logo);
  const salary = formatSalary(job);
  const experience = formatExperience(job);

  return (
    <Link to={`/careers/${job.id}`} className="lk-job-card">
      <div className="lk-job-card-top">
        <div className="lk-job-card-logo">
          {logoUrl ? (
            <img src={logoUrl} alt={job.companyName} />
          ) : (
            <Building2 size={22} />
          )}
        </div>

        <div className="lk-job-card-topmeta">
          <span className="lk-job-card-verified">
            <BadgeCheck size={13} />
            Verified
          </span>
          {job.workMode && <span className="lk-job-card-mode">{job.workMode}</span>}
        </div>
      </div>

      <div className="lk-job-card-body">
        <span className="lk-job-card-company">{job.companyName}</span>
        <h5>{job.jobTitle}</h5>

        <div className="lk-job-card-tags">
          {job.jobType && <span className="lk-job-card-tag">{job.jobType}</span>}
          {experience && (
            <span className="lk-job-card-tag lk-job-card-tag-muted">
              <Briefcase size={12} />
              {experience}
            </span>
          )}
        </div>
      </div>

      <div className="lk-job-card-footer">
        <div className="lk-job-card-salary">
          {salary ? <strong>{salary}</strong> : <span className="lk-job-card-salary-empty">Salary not disclosed</span>}
        </div>
        <span className="lk-job-card-cta">
          View <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export default JobCard;