import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { IFormStepProps } from "@/Interfaces/ICourseRespone";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchQualifications = async () => {
      if (!token || !courseId) return;
      try {
        const allQualificationsResponse = await courseQualificationService.getQualifications(token) || [];
        const courseQualificationsResponse = await courseQualificationService.getCourseQualifications(token, courseId) || [];

        setQualifications(allQualificationsResponse.data);
        setCourseQualifications(courseQualificationsResponse.data);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
        toast.error("Failed to load qualifications.");
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

  const handleSelectQualification = (id: number) => {
    if (!courseQualifications.some(q => q.id === id)) {
      setCourseQualifications([...courseQualifications, qualifications.find(q => q.id === id)!]);

      courseQualificationService.linkQualificationToCourse(token, courseId, id)
        .then(() => toast.success("Qualification added successfully!"))
        .catch(error => {
          console.error("Error linking qualification:", error);
          toast.error("Failed to link qualification to course.");
        });
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
      await courseQualificationService.unlinkQualificationFromCourse(token,  id);
      setCourseQualifications(courseQualifications.filter(q => q.id !== id));
      toast.success("Qualification removed successfully!");
    } catch (error) {
      console.error("Error unlinking qualification:", error);
      toast.error("Failed to unlink qualification.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Course Qualifications</h2>

      <div className="space-y-2">
        <Label>Qualifications Linked to This Course:</Label>
        <div className="border rounded-md p-2 bg-gray-100 space-y-2 max-h-60 overflow-y-auto">
          {courseQualifications.length > 0 ? (
            courseQualifications.map(q => (
              <div key={q.id} className="flex justify-between items-start gap-4 border p-3 rounded bg-white hover:bg-gray-50 transition cursor-pointer">
                <span className="text-sm break-words max-w-[70%]">{q.attributes.qualification_name}</span>
                <Button type="button" variant="destructive" onClick={() => handleRemoveQualification(q.id)} className="shrink-0 cursor-pointer hover:bg-red-100 transition">
                  <X />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No qualifications linked yet.</p>
          )}
        </div>
      </div>
  {/* Search and select */}
      <div className="space-y-2">
        <Label htmlFor="instructor-search">Search Instructors</Label>
        <Input
          id="instructor-search"
          type="text"
          placeholder="Search instructors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="max-h-40 overflow-y-auto border p-2 rounded space-y-2">
          {filteredQualifications.map((qual) => (
            <Button
              key={qual.id}
              onClick={() => handleSelectQualification(qual.id)}
              className="w-full text-left truncate hover:bg-gray-100 hover:text-black cursor-pointer transition"
              title={qual.attributes.qualification_name}
            >
              {qual.attributes.qualification_name}
            </Button>
          ))}
        </div>
      </div>
         <div className="space-y-2">
      <QualificationFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleAddNewQualification} />

      <Button onClick={() => setIsModalOpen(true)} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white transition" disabled={loading}>
        {loading ? "Adding..." : "Add Qualification"}
      </Button>
      </div>
    </div>
  );
};

export default CourseQualificationsForm;