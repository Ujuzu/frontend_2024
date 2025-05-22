import { useEffect, useState, useCallback } from "react";
import { curriculumLessonService } from "@/service/curriculumLessonService";
import { toast } from "react-hot-toast";
import { ILoginToken } from "@/Interfaces/IUserLoginInterfaces";
import { ICurriculumLessonResponse } from "@/Interfaces/ICurriculumLessons";

const useFetchCurriculumLessons = (token: ILoginToken | null, curriculumId: number | undefined, shouldFetch: boolean = true) => {
  const [lessons, setLessons] = useState<ICurriculumLessonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch when dependencies change
  useEffect(() => {
    const fetchLessons = async () => {
      if (!token || !curriculumId || !shouldFetch) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await curriculumLessonService.getCurriculumLessons(token, curriculumId);
        setLessons(response.data);
      } catch (error) {
        const errorMessage = "Error fetching lessons.";
        console.error("Error fetching lessons:", error);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [token, curriculumId, shouldFetch]);

  // Manual refresh function
  const refreshLessons = useCallback(async () => {
    if (!token || !curriculumId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await curriculumLessonService.getCurriculumLessons(token, curriculumId);
      setLessons(response.data);
    } catch (error) {
      const errorMessage = "Error fetching lessons.";
      console.error("Error fetching lessons:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, curriculumId]);

  return { 
    lessons, 
    loading, 
    error,
    refreshLessons
  };
};

export default useFetchCurriculumLessons;