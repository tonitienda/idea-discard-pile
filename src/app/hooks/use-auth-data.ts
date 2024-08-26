import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          ...options,
          redirect: "manual", // Prevent automatic redirects
        });

        if (response.status === 302 || response.status === 307) {
          // Redirect to the login page if not authenticated
          const loginUrl = response.headers.get("Location");
          if (loginUrl) {
            router.push(loginUrl);
          }
        } else if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options, router]);

  return { data, loading, error };
}
