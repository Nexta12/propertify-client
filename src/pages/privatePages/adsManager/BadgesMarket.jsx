import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CATEGORY_COLORS, DEFAULT_BADGES } from "@utils/data";

function classNames(...cn) {
  return cn.filter(Boolean).join(" ");
}

export default function BadgesMarketplace({
  badges = DEFAULT_BADGES,
  currencySymbol = "₦",
  onPurchase,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(badges.map((b) => b.category));
    return ["all", ...Array.from(set)];
  }, [badges]);

  const filtered = useMemo(() => {
    return badges.filter((b) => {
      const matchesQuery =
        !query ||
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || b.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [badges, query, category]);

  const handleOpen = (badge) => {
    setSelected(badge);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 200);
  };

  const handlePurchase = () => {
    if (!selected) return;
    if (typeof onPurchase === "function") {
      onPurchase(selected);
    } else {
      // Fallback behavior; replace with toast or navigation as needed
      alert(`Purchased: ${selected.name}`);
    }
    handleClose();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Badge Marketplace
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Boost trust, showcase expertise, and stand out with profile badges.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search badges..."
          className="w-full md:flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 appearance-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            ▾
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((badge) => (
          <div
            key={badge.id}
            className="group border border-gray-200 dark:border-gray-800 rounded-2xl p-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="text-3xl" aria-hidden>
                {badge.emoji}
              </div>
              <span
                className={classNames(
                  "text-xs px-2 py-1 rounded-full border",
                  CATEGORY_COLORS[badge.category] ||
                    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                )}
              >
                {badge.category}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {badge.name}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {badge.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Cost</div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {currencySymbol}
                  {badge.cost.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right">Duration</div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {badge.durationDays} days
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpen(badge)}
              className="mt-4 w-full py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              View details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-800">
                  {selected && (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl" aria-hidden>
                            {selected.emoji}
                          </div>
                          <div>
                            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {selected.name}
                            </Dialog.Title>
                            <p
                              className={classNames(
                                "mt-1 inline-flex text-xs px-2 py-1 rounded-full border",
                                CATEGORY_COLORS[selected.category] ||
                                  "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                              )}
                            >
                              {selected.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleClose}
                          className="rounded-lg px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          aria-label="Close"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-700 dark:text-gray-300">{selected.description}</p>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Cost</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {currencySymbol}
                            {selected.cost.toLocaleString()}
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {selected.durationDays} days
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Terms of Use
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                          {selected.terms.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                          onClick={handleClose}
                          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Close
                        </button>
                        <button
                          onClick={handlePurchase}
                          className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          Purchase
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
