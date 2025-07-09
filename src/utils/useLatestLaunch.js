import { useState, useEffect } from "react";

// Custom hook to fetch latest SpaceX launch data
const useLatestLaunch = () => {
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaunch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://api.spacexdata.com/v5/launches/latest"
        );
        if (!res.ok) throw new Error("Failed to fetch launch data");
        const data = await res.json();
        console.log("SpaceX API response:", data); // Debug: log API response
        setLaunch(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLaunch();
  }, []);

  return { launch, loading, error };
};

export default useLatestLaunch;
