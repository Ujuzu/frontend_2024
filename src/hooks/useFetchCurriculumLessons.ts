import { useEffect, useState, useCallback } from "react";
import { curriculumLessonService } from "@/service/curriculumLessonService";
import { toast } from "react-hot-toast";
import { ILoginToken } from "@/Interfaces/IUserLoginInterfaces";
import { ICurriculumLessonResponse } from "@/Interfaces/ICurriculumLessons";

const useFetchCurriculumLessons = (token: ILoginToken | null, curriculumDocId: string | undefined, shouldFetch: boolean = true) => {
  const [lessons, setLessons] = useState<ICurriculumLessonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch when dependencies change
  useEffect(() => {
    const fetchLessons = async () => {
      if (!token || !curriculumDocId || !shouldFetch) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await curriculumLessonService.getCurriculumLessons(token, curriculumDocId);
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
  }, [token, curriculumDocId, shouldFetch]);

  // Manual refresh function
  const refreshLessons = useCallback(async () => {
    if (!token || !curriculumDocId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await curriculumLessonService.getCurriculumLessons(token, curriculumDocId);
      setLessons(response.data);
    } catch (error) {
      const errorMessage = "Error fetching lessons.";
      console.error("Error fetching lessons:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, curriculumDocId]);

  return { 
    lessons, 
    loading, 
    error,
    refreshLessons
  };
};

export default useFetchCurriculumLessons;