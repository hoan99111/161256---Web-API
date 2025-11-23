export default function Pagination({ total, currentPage, onChange }) {
  return (
    <div className="pagination">
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={p === currentPage ? "active" : ""}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
