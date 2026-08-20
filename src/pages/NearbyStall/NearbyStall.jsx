import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Loader2, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import LocationBar from "../../components/LocationBar/LocationBar";
import {
  fetchNearStalls,
  searchNearStalls,
  normalizeProvider,
  hasLocationFilter,
  formatPrice,
} from "../../api/lokalApi";
import "./NearbyStall.css";

const PER_PAGE = 12;

const NearbyStall = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Any time the location filter changes, start back at page 1.
  useEffect(() => {
    setPage(1);
  }, [location]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetcher = hasLocationFilter(location) ? searchNearStalls : fetchNearStalls;
    fetcher({
      cityId: location?.cityId,
      latitude: location?.latitude,
      longitude: location?.longitude,
      radius: location?.radius,
      page,
      perPage: PER_PAGE,
    })
      .then((data) => {
        if (cancelled) return;
        const normalized = (data || []).map((raw) => normalizeProvider(raw, "stall"));
        setStalls(normalized);
        // If the API returned a full page, assume there could be more.
        setHasMore(normalized.length === PER_PAGE);
        setError(null);
      })
      .catch(() => !cancelled && setError("Couldn't load nearby stalls right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [location, page]);

  return (
    <div className="section nearby-page">
      <div className="con">
        <SectionHeader
          eyebrow="Nearby"
          title="Nearby Shop & Stall"
          subtitle="Everyday shops and stalls within walking distance."
        />

        <div className="nearby-toolbar">
          <LocationBar onChange={setLocation} />
        </div>

        <div className="nearby-page-layout nearby-page-layout-with-warning near-new">
          <div className="nearby-page-main">
            {loading && (
              <p className="text-muted">
                <Loader2 className="spin" size={16} /> Loading nearby stalls...
              </p>
            )}
            {!loading && error && <p className="text-muted">{error}</p>}
            {!loading && !error && stalls.length === 0 && (
              <p className="text-muted">No nearby stalls listed yet.</p>
            )}

            {!loading && !error && stalls.length > 0 && (
              <>
                <div className="nearby-grid">
                  {stalls.map((stall) => (
                    <Link to={`/provider/stall/${stall.id}`} className="nearby-card" key={stall.id}>
                      <img src={stall.photo} alt={stall.name} loading="lazy" />
                      <div className="nearby-card-body">
                        {stall.subtitle && <span className="text-muted nearby-card-type">{stall.subtitle}</span>}
                        <h4>{stall.name}</h4>
                        <p className="nearby-card-loc">
                          <MapPin size={12} /> {stall.city || stall.addressLine1}
                        </p>
                        <div className="nearby-card-meta">
                          <span className="vendor-card-rating">
                            <Star size={13} fill="currentColor" /> New
                          </span>
                          {formatPrice(stall.price) && (
                            <span className="nearby-card-price">{formatPrice(stall.price)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="nearby-pagination">
                  <button
                    type="button"
                    className="nearby-pagination-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <span className="text-muted nearby-pagination-page">Page {page}</span>
                  <button
                    type="button"
                    className="nearby-pagination-btn"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore || loading}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="nearby-warning-card">
            <div className="nearby-warning-card-icon">
              <ShieldAlert size={22} />
            </div>
            <h4>Important Warning</h4>
            <ul className="nearby-warning-card-list">
              <li>
                The service provider is solely responsible for the services they offer and any payment or
                amount requested from you.
              </li>
              <li>
                The website owner is not involved in or connected with any payment process between customers
                and service providers.
              </li>
              <li>
                If you face any issue with a service, payment, refund, or transaction, please contact the
                respective service provider directly.
              </li>
              <li>
                The website owner will not be responsible for any payment dispute, service issue, financial
                loss, or transaction made between the customer and service provider.
              </li>
              <li>Please verify the service provider and payment details before making any payment.</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NearbyStall;