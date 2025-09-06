import { useEffect, useState, useCallback } from "react";
import { courseWeeklyCurriculumService } from "@/service/courseWeeklyCurriculumService";
import { toast } from "react-hot-toast";
import { ILoginToken } from "@/Interfaces/IUserLoginInterfaces";
import { IWeeklyCurriculumResponse } from "@/Interfaces/IWeeklyCurriculum";

const useFetchWeeklyCurricula = (token: ILoginToken | null, courseDocId: string) => {
  const [weeklyCurricula, setWeeklyCurricula] = useState<IWeeklyCurriculumResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch when token or courseId changes
  useEffect(() => {
    const fetchWeeklyCurricula = async () => {
      if (!token || !courseDocId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await courseWeeklyCurriculumService.getCourseWeeklyCurricula(token, courseDocId);
        setWeeklyCurricula(response.data);
      } catch (error) {
        const errorMessage = "Failed to fetch weekly curricula.";
        console.error("Error fetching weekly curricula:", error);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyCurricula();
  }, [token, courseDocId]);

  // Manual refresh function
  const refreshWeeklyCurricula = useCallback(async () => {
    if (!token || !courseDocId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await courseWeeklyCurriculumService.getCourseWeeklyCurricula(token, courseDocId);
      setWeeklyCurricula(response.data);
    } catch (error) {
      const errorMessage = "Failed to fetch weekly curricula.";
      console.error("Error fetching weekly curricula:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, courseDocId]);

  return { 
    weeklyCurricula, 
    loading, 
    error,
    refreshWeeklyCurricula
  };
};

export default useFetchWeeklyCurricula;