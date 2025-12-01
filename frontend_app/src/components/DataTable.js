import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * DataTable
 * Client-side table with search filter, sortable name column, and pagination. Responsive stacking on small screens.
 */
export default function DataTable() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const rows = useMemo(
    () => [
      { id: 1, name: "Alice Johnson", role: "Designer", team: "UX" },
      { id: 2, name: "Bob Smith", role: "Engineer", team: "Platform" },
      { id: 3, name: "Carmen Doe", role: "PM", team: "Growth" },
      { id: 4, name: "Daniel Wu", role: "Engineer", team: "Core" },
      { id: 5, name: "Eve García", role: "QA", team: "Quality" },
      { id: 6, name: "Farah Khan", role: "Engineer", team: "Data" },
      { id: 7, name: "Gabe Li", role: "Support", team: "Success" },
      { id: 8, name: "Hannah Lee", role: "Engineer", team: "Platform" },
      { id: 9, name: "Ian Brown", role: "Designer", team: "Brand" },
      { id: 10, name: "Jin Park", role: "Engineer", team: "Core" },
      { id: 11, name: "Kelly Zhou", role: "PM", team: "Growth" },
      { id: 12, name: "Luis Silva", role: "Engineer", team: "Data" },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = rows.filter((r) =>
    [r.name, r.role, r.team].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return sortAsc ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changePage = (p) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <section aria-label="Data Table" className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Data Table</span>
        </h2>
        <p className="text-sm text-slate-600">Filter, sort, and paginate client-side.</p>
      </header>

      <div className="surface p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex-1 gradient-accent rounded-lg">
            <input
              className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
              placeholder="Search by name, role, or team"
              aria-label="Search table"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button
            type="button"
            className="rounded-lg text-white px-4 py-2 font-semibold focus-ring"
            onClick={() => setSortAsc((v) => !v)}
            style={{ background: gradient }}
            aria-label="Toggle name sort"
          >
            <span style={{ textTransform: "uppercase" }}>
              Sort: {sortAsc ? "A→Z" : "Z→A"}
            </span>
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/60 sticky top-0 z-10">
              <tr className="text-left text-slate-600">
                <th className="px-3 py-2 font-semibold uppercase tracking-wide text-xs">ID</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wide text-xs">Name</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wide text-xs">Role</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-wide text-xs">Team</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t border-gray-200 hover:bg-indigo-50/40 transition-colors`}
                >
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.role}</td>
                  <td className="px-3 py-2">{r.team}</td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center">
                    <div className="text-slate-500">
                      <p className="text-sm">No results found.</p>
                      <p className="text-xs mt-1">Try a different search or clear filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full h-9 w-9 grid place-items-center text-white focus-ring disabled:opacity-50"
              style={{ background: gradient }}
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            <span className="text-sm">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="rounded-full h-9 w-9 grid place-items-center text-white focus-ring disabled:opacity-50"
              style={{ background: gradient }}
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
