import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function EditPG() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    facilities: "",
    gender: "boys",
  });

  useEffect(() => {
    API.get(`/api/pgs/${id}`).then((res) => {
      const pg = res.data;

      setForm({
        title: pg.title,
        location: pg.location,
        price: pg.price,
        facilities: pg.facilities?.join(","),
        gender: pg.gender,
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.put(`/api/pgs/${id}`, {
      ...form,
      facilities: form.facilities.split(","),
    });

    alert("PG Updated!");
    navigate("/admin");
  };

  return (
    <div className="app-shell px-4 py-8 sm:px-6">
      <div className="glass-panel-strong page-enter mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Edit PG
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Fine-tune your listing with a cleaner, more comfortable editing flow.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-surface sm:col-span-2"
          />

          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input-surface"
          />

          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-surface"
          />

          <input
            value={form.facilities}
            onChange={(e) => setForm({ ...form, facilities: e.target.value })}
            className="input-surface sm:col-span-2"
          />

          <button className="btn-primary sm:col-span-2 px-4 py-3.5 text-sm font-semibold">
            Update PG
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPG;
