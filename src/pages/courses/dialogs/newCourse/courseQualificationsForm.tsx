import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Loader2, GraduationCap } from "lucide-react";
import { ICourseQualificationReqResponse, IQualificationReqAttributes } from "@/Interfaces/IQualificationRequirement";
import { courseQualificationService } from "@/service/courseQualificationReqService";
import QualificationFormModal from "../../components/QualificationFormModal";
import { Input } from "@/components/ui/input";

const CourseQualificationsForm: React.FC<IFormStepProps> = ({ courseId }) => {
  const { token } = useAuth();
  const [qualifications, setQualifications] = useState<ICourseQualificationReqResponse[]>([]);
  const [courseQualifications, setCourseQualifications] = useState<ICourseQualificationReqResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingQualification, setAddingQualification] = useState<number | null>(null);
  const [removingQualification, setRemovingQualification] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchQualifications = async () => {
      if (!token || !courseId) return;
      
      try {
        setInitialLoading(true);
        const [allQualificationsResponse, courseQualificationsResponse] = await Promise.all([
          courseQualificationService.getQualifications(token),
          courseQualificationService.getCourseQualifications(token, courseId)
        ]);
        
        setQualifications(allQualificationsResponse?.data || []);
        setCourseQualifications(courseQualificationsResponse?.data || []);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
        toast.error("Failed to load qualifications.");
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchQualifications();
  }, [token, courseId]);

  const filteredQualifications = qualifications
    .filter(q =>
      q.attributes.qualification_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !courseQualifications.some(courseQ => courseQ.id === q.id)
    )
    .slice(0, 5);

  // Simulate search loading when typing
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchLoading(true);
      const timer = setTimeout(() => setSearchLoading(false), 300);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  const handleSelectQualification = async (id: number) => {
    if (courseQualifications.some(q => q.id === id)) return;
    
    try {
      setAddingQualification(id);
      const selectedQual = qualifications.find(q => q.id === id)!;
      setCourseQualifications([...courseQualifications, selectedQual]);
      
      await courseQualificationService.linkQualificationToCourse(token, courseId, id);
      toast.success("Qualification added successfully!");
    } catch (error) {
      console.error("Error linking qualification:", error);
      setCourseQualifications(courseQualifications.filter(q => q.id !== id));
      toast.error("Failed to link qualification to course.");
    } finally {
      setAddingQualification(null);
    }
  };

  const handleAddNewQualification = async (newQualificationData: IQualificationReqAttributes) => {
    if (!newQualificationData.qualification_name.trim() || !token || !courseId) {
      toast.error("Course ID is required to add a qualification.");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...newQualificationData, courses: [courseId] };
      const response = await courseQualificationService.createQualification(token, payload);
      
      setQualifications([...qualifications, response]);
      setCourseQualifications([...courseQualifications, response]);
      toast.success("Qualification added successfully!");
    } catch (error) {
      console.error("Error creating qualification:", error);
      toast.error("Failed to add qualification.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQualification = async (id: number) => {
    try {
      setRemovingQualification(id);
      await courseQualificationService.unlinkQualificationFromCourse(token, id);
      setCourseQualifications(courseQualifications.filter(q => q.id !== id));
      toast.success("Qualification removed successfully!");
    } catch (error) {
      console.error("Error unlinking qualification:", error);
      toast.error("Failed to unlink qualification.");
    } finally {
      setRemovingQualification(null);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-purple-900">Course Qualifications</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-gray-600 font-medium">Loading qualifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Course Qualifications</h2>
      </div>

      {/* Current Qualifications */}
      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Qualifications Linked to This Course:</Label>
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3 max-h-60 overflow-y-auto">
          {courseQualifications.length > 0 ? (
            courseQualifications.map(q => (
              <div 
                key={q.id} 
                className="flex justify-between items-start gap-4 border border-gray-200 p-4 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              >
                <span className="text-sm break-words max-w-[70%] text-gray-900 font-medium">
                  {q.attributes.qualification_name}
                </span>
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveQualification(q.id)} 
                  className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  disabled={removingQualification === q.id}
                >
                  {removingQualification === q.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No qualifications linked yet.</p>
              <p className="text-xs text-gray-500 mt-1">Search and add qualifications below</p>
            </div>
          )}
        </div>
      </div>

      {/* Search and Select */}
      <div className="space-y-3">
        <Label htmlFor="qualification-search" className="text-gray-700 font-medium">
          Available Qualifications
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="qualification-search"
            type="text"
            placeholder="Search qualifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg bg-white">
          {searchLoading ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <p className="text-sm text-gray-600">Loading qualifications...</p>
              </div>
            </div>
          ) : filteredQualifications.length > 0 ? (
            <div className="p-2 space-y-2">
              {filteredQualifications.map((qual) => (
                <Button
                  key={qual.id}
                  onClick={() => handleSelectQualification(qual.id)}
                  variant="ghost"
                  className="w-full text-left justify-start p-3 hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 border border-transparent hover:border-purple-200 rounded-md"
                  title={qual.attributes.qualification_name}
                  disabled={addingQualification === qual.id}
                >
                  {addingQualification === qual.id ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-purple-600">Adding...</span>
                    </div>
                  ) : (
                    <span className="truncate text-gray-700">{qual.attributes.qualification_name}</span>
                  )}
                </Button>
              ))}
            </div>
          ) : qualifications.length === 0 ? (
            <div className="p-6 text-center">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No qualifications available</p>
              <p className="text-xs text-gray-500 mt-1">Create a new qualification using the button below</p>
            </div>
          ) : courseQualifications.length === qualifications.length ? (
            <div className="p-6 text-center">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">All qualifications are already linked</p>
              <p className="text-xs text-gray-500 mt-1">Create a new qualification using the button below</p>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No qualifications match your search
            </div>
          )}
        </div>
      </div>

      {/* Add New Qualification */}
      <div className="border-t border-gray-200 pt-6">
        <QualificationFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleAddNewQualification} 
        />
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add New Qualification</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CourseQualificationsForm;
