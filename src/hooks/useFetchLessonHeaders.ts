import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { ILoginToken } from "@/Interfaces/IUserLoginInterfaces";
import { ILessonHeaderResponse } from "@/Interfaces/ILessonHeaders";
import { lessonHeaderService } from "@/service/curriculumLessonHeaderService";


const useFetchLessonHeaders = (token: ILoginToken | null, lessonId: number | undefined, shouldFetch: boolean = true) => {
  const [headers, setHeaders] = useState<ILessonHeaderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch when dependencies change
  useEffect(() => {
    const fetchHeaders = async () => {
      if (!token || !lessonId || !shouldFetch) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await lessonHeaderService.getCurriculumLessonsHeader(token, lessonId);
        setHeaders(response.data);
      } catch (error) {
        const errorMessage = "Error fetching lesson headers.";
        console.error("Error fetching lesson headers:", error);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaders();
  }, [token, lessonId, shouldFetch]);

  // Manual refresh function
  const refreshHeaders = useCallback(async () => {
    if (!token || !lessonId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await lessonHeaderService.getCurriculumLessonsHeader(token, lessonId);
      setHeaders(response.data);
    } catch (error) {
      const errorMessage = "Error fetching lesson headers.";
      console.error("Error fetching lesson headers:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, lessonId]);

  return { 
    headers, 
    loading, 
    error,
    refreshHeaders
  };
};

export default useFetchLessonHeaders;