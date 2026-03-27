import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [pgs, setPgs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    API.get("/api/pgs").then((res) => setPgs(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/api/bookings/${id}`, { status });

    const res = await API.get("/api/bookings");
    setBookings(res.data);
  };

  const deletePG = async (id) => {
    await API.delete(`/api/pgs/${id}`);
    const res = await API.get("/api/pgs");
    setPgs(res.data);
  };

  return (
    <div className="app-shell px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="glass-panel-strong page-enter flex flex-col gap-4 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Manage bookings and listings from one responsive workspace.
            </h1>
          </div>
          <button
            onClick={() => navigate("/admin/add-pg")}
            className="btn-primary px-5 py-3 text-sm font-semibold"
          >
            + Add New PG
          </button>
        </div>

        <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Bookings</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {bookings.length} requests
            </span>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/80 text-sm text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Name</th>
                  <th className="pb-3 pr-4 font-semibold">Phone</th>
                  <th className="pb-3 pr-4 font-semibold">PG</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b border-slate-200/60">
                    <td className="py-4 pr-4 font-medium text-slate-900">{b.name}</td>
                    <td className="py-4 pr-4 text-slate-600">{b.phone}</td>
                    <td className="py-4 pr-4 text-slate-600">{b.pg?.title}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-800">
                          {b.status}
                        </span>
                        <button
                          onClick={() => updateStatus(b._id, "contacted")}
                          className="btn-secondary px-3 py-2 text-xs font-semibold"
                        >
                          Contacted
                        </button>
                        <button
                          onClick={() => updateStatus(b._id, "closed")}
                          className="btn-primary px-3 py-2 text-xs font-semibold"
                        >
                          Closed
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {bookings.map((b) => (
              <div key={b._id} className="rounded-[1.5rem] bg-white/75 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{b.name}</h3>
                    <p className="text-sm text-slate-500">{b.phone}</p>
                    <p className="mt-1 text-sm text-slate-600">{b.pg?.title}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-800">
                    {b.status}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => updateStatus(b._id, "contacted")}
                    className="btn-secondary flex-1 px-3 py-2 text-xs font-semibold"
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "closed")}
                    className="btn-primary flex-1 px-3 py-2 text-xs font-semibold"
                  >
                    Closed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Manage PGs</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {pgs.length} listings
            </span>
          </div>

          <div className="grid gap-4">
            {pgs.map((pg) => (
              <div
                key={pg._id}
                className="rounded-[1.6rem] bg-white/75 p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{pg.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{pg.location}</p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => navigate(`/admin/edit-pg/${pg._id}`)}
                      className="btn-secondary px-4 py-2.5 text-sm font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePG(pg._id)}
                      className="btn-primary px-4 py-2.5 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
