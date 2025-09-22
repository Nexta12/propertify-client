import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import useAuthStore from "@store/authStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners"; // Assuming you already have this
import { truncate } from "lodash";

const Step1ChoosePost = ({ formData, setFormData }) => {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const { user, validateAuth } = useAuthStore();
  const [authLoading, setAuthLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        await validateAuth();
      } finally {
        setAuthLoading(false);
      }
    };
    verifyAuth();
  }, [validateAuth]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user?.slug) return;

      setLoading(true);
      try {
        const res = await apiClient.get(`${endpoints.fetchUserProperties}/${user.slug}`, {
          params: {
            promo: true,
            page,
            limit: perPage,
            search: debouncedSearch || undefined,
          },
        });
        const filtered = res.data.data.data;

        setPosts(filtered);
        setPagination(res.data.data.pagination);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user?.slug, page, debouncedSearch]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        <PuffLoader height="80" width="80" radius={1} color="#4866ff" aria-label="puff-loading" />
      </div>
    );
  }

  const handleSelectPost = (post) => {
    setFormData({ ...formData, post });
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex">
        <input
          type="text"
          placeholder="Search posts..."
          className="border dark:border-gray-700 dark:focus:outline-none rounded px-3 py-2 mb-4 w-full lg:w-[50%] ml-auto focus:outline-none text-sm dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <PuffLoader color="#4866ff" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              onClick={() => handleSelectPost(post)}
              className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 self-start  ${
                formData.post?._id === post._id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {post.media &&
                post.media.length > 0 &&
                (post.media[0].type === "image" ? (
                  <img
                    src={post.media[0].url}
                    alt="Property"
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <video controls className="w-full h-32 object-cover">
                    <source src={post.media[0].url} type="video/mp4" />
                  </video>
                ))}

              <h3 className="mt-2 text-gray-800 dark:text-white font-medium">{post.title}</h3>

              <h3 className="mt-4 text-gray-800 dark:text-white text-center text-sm">
                {truncate(post.description, { length: 120 })}
              </h3>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 dark:text-gray-300"
        >
          Previous
        </button>
        <button
          disabled={page * perPage >= pagination.total}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 dark:text-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1ChoosePost;
